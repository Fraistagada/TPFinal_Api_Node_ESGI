const db = require("../database");

async function getTables(req, res) {
  try {
    const [tables] = await db.query("SELECT * FROM tables_restaurant");
    res.json(tables);
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function addTable(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const { numero, capacite } = req.body;

  if (!numero || !capacite) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const [resultat] = await db.query(
      "INSERT INTO tables_restaurant (numero, capacite) VALUES (?, ?)",
      [numero, capacite],
    );

    console.log("[NOTIFICATION] Nouvelle table #" + numero + " ajoutée (capacité: " + capacite + ")");

    res.json({ message: "Table ajoutée", id: resultat.insertId });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function updateTable(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const id = req.params.id;
  const { numero, capacite } = req.body;

  try {
    const [tables] = await db.query(
      "SELECT * FROM tables_restaurant WHERE id = ?",
      [id],
    );

    if (tables.length === 0) {
      return res.status(404).json({ message: "Table introuvable" });
    }

    await db.query(
      "UPDATE tables_restaurant SET numero=?, capacite=? WHERE id=?",
      [numero, capacite, id],
    );

    console.log("[NOTIFICATION] Table #" + id + " modifiée");

    res.json({ message: "Table modifiée" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function deleteTable(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const id = req.params.id;

  try {
    const [tables] = await db.query(
      "SELECT * FROM tables_restaurant WHERE id = ?",
      [id],
    );

    if (tables.length === 0) {
      return res.status(404).json({ message: "Table introuvable" });
    }

    await db.query("DELETE FROM tables_restaurant WHERE id=?", [id]);

    console.log("[NOTIFICATION] Table #" + id + " supprimée");

    res.json({ message: "Table supprimée" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function getDisponibilites(req, res) {
  const { date, time } = req.query;

  if (!date || !time) {
    return res.status(400).json({ message: "Paramètres date et time requis" });
  }

  try {
    const [tables] = await db.query("SELECT * FROM tables_restaurant");

    const [tablesReservees] = await db.query(
      `SELECT tr.table_id
       FROM reservation_tables tr
       JOIN reservations r ON r.id = tr.reservation_id
       WHERE r.date = ? AND r.time = ? AND r.statut != 'cancelled'`,
      [date, time],
    );

    const idsReservees = tablesReservees.map((t) => t.table_id);

    const tablesDisponibles = tables.filter(
      (t) => !idsReservees.includes(t.id),
    );

    let capaciteTotale = 0;
    for (let table of tablesDisponibles) {
      capaciteTotale += table.capacite;
    }

    res.json({
      date: date,
      time: time,
      tables_disponibles: tablesDisponibles,
      capacite_totale_disponible: capaciteTotale,
    });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  getTables,
  addTable,
  updateTable,
  deleteTable,
  getDisponibilites,
};
