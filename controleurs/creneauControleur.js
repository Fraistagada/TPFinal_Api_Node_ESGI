const db = require("../database");

async function getCreneaux(req, res) {
  try {
    let sql = "SELECT * FROM creneaux";
    let params = [];

    if (req.query.jour) {
      sql += " WHERE jour = ?";
      params.push(req.query.jour);
    }

    const [creneaux] = await db.query(sql, params);
    res.json(creneaux);
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function addCreneau(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const { jour, heure_ouverture, heure_fermeture } = req.body;

  if (!jour || !heure_ouverture || !heure_fermeture) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const [resultat] = await db.query(
      "INSERT INTO creneaux (jour, heure_ouverture, heure_fermeture) VALUES (?, ?, ?)",
      [jour, heure_ouverture, heure_fermeture],
    );

    console.log("[NOTIFICATION] Créneau ajouté : " + jour + " de " + heure_ouverture + " à " + heure_fermeture);

    res.json({ message: "Créneau ajouté", id: resultat.insertId });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function updateCreneau(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const id = req.params.id;
  const { jour, heure_ouverture, heure_fermeture } = req.body;

  try {
    const [creneaux] = await db.query("SELECT * FROM creneaux WHERE id = ?", [id]);

    if (creneaux.length === 0) {
      return res.status(404).json({ message: "Créneau introuvable" });
    }

    await db.query(
      "UPDATE creneaux SET jour=?, heure_ouverture=?, heure_fermeture=? WHERE id=?",
      [jour, heure_ouverture, heure_fermeture, id],
    );

    console.log("[NOTIFICATION] Créneau #" + id + " modifié");

    res.json({ message: "Créneau modifié" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function deleteCreneau(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const id = req.params.id;

  try {
    const [creneaux] = await db.query("SELECT * FROM creneaux WHERE id = ?", [id]);

    if (creneaux.length === 0) {
      return res.status(404).json({ message: "Créneau introuvable" });
    }

    await db.query("DELETE FROM creneaux WHERE id=?", [id]);

    console.log("[NOTIFICATION] Créneau #" + id + " supprimé");

    res.json({ message: "Créneau supprimé" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  getCreneaux,
  addCreneau,
  updateCreneau,
  deleteCreneau,
};
