const db = require("../database");

async function getReservations(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  try {
    const [reservations] = await db.query("SELECT * FROM reservations");

    res.json(reservations);
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getMyReservations(req, res) {
  const user_id = req.utilisateur.id;

  try {
    const [reservations] = await db.query(
      "SELECT * FROM reservations WHERE user_id = ?",
      [user_id],
    );
    res.json(reservations);
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function addReservation(req, res) {
  const { name, phone, number_of_people, date, time, note } = req.body;

  const user_id = req.utilisateur.id;

  if (!number_of_people || !date || !time) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const [tables] = await db.query(
      "SELECT * FROM tables_restaurant ORDER BY capacite ASC",
    );

    const [tablesReservees] = await db.query(
      `SELECT tr.table_id
             FROM reservation_tables tr
             JOIN reservations r ON r.id = tr.reservation_id
             WHERE r.date = ? AND r.time = ?`,
      [date, time],
    );

    const idsReservees = tablesReservees.map((t) => t.table_id);

    const tablesDisponibles = tables.filter(
      (t) => !idsReservees.includes(t.id),
    );

    let capaciteTotale = 0;
    let tablesChoisies = [];

    for (let table of tablesDisponibles) {
      tablesChoisies.push(table);

      capaciteTotale += table.capacite;

      if (capaciteTotale >= number_of_people) {
        break;
      }
    }

    if (capaciteTotale < number_of_people) {
      return res.status(400).json({ message: "Capacité insuffisante" });
    }

    const [resultat] = await db.query(
      `INSERT INTO reservations 
            (user_id, name, phone, number_of_people, date, time, note, statut)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'en_attente')`,
      [user_id, name, phone, number_of_people, date, time, note],
    );

    const reservation_id = resultat.insertId;

    for (let table of tablesChoisies) {
      await db.query(
        "INSERT INTO reservation_tables (reservation_id, table_id) VALUES (?, ?)",
        [reservation_id, table.id],
      );
    }

    res.json({
      message: "Réservation créée",
      reservation_id: reservation_id,
    });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function updateReservation(req, res) {
  const reservation_id = req.params.id;
  const { name, phone, number_of_people, date, time, note } = req.body;

  try {
    const [reservations] = await db.query(
      "SELECT * FROM reservations WHERE id = ?",
      [reservation_id],
    );

    if (reservations.length === 0) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    const reservation = reservations[0];

    if (reservation.statut !== "pending") {
      return res.status(400).json({ message: "Réservation non modifiable" });
    }

    await db.query(
      `UPDATE reservations 
SET name=?, phone=?, number_of_people=?, date=?, time=?, note=?
WHERE id=?`,
      [name, phone, number_of_people, date, time, note, reservation_id],
    );

    res.json({ message: "Réservation modifiée" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function deleteReservation(req, res) {
  const reservation_id = req.params.id;

  try {
    await db.query(
      "UPDATE reservations SET statut='cancelled' WHERE id=?",
      [reservation_id],
    );

    res.json({ message: "Réservation annulée" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function validateReservation(req, res) {
  const reservation_id = req.params.id;

  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  try {
    const [reservations] = await db.query(
      "SELECT statut FROM reservations WHERE id=?",
      [reservation_id],
    );

    if (reservations.length === 0) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    if (reservations[0].statut !== "pending") {
      return res.status(400).json({ message: "Réservation déjà traitée" });
    }

    await db.query(
      "UPDATE reservations SET statut='confirmed' WHERE id=?",
      [reservation_id],
    );

    res.json({ message: "Réservation confirmée" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  getReservations,
  getMyReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  validateReservation,
};
