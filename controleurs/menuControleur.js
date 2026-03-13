const db = require("../database");

async function getMenu(req, res) {
  try {
    let sql = "SELECT * FROM menu WHERE 1=1";
    let params = [];

    if (req.query.categorie) {
      sql += " AND categorie = ?";
      params.push(req.query.categorie);
    }

    if (req.query.prix_max) {
      sql += " AND prix <= ?";
      params.push(req.query.prix_max);
    }

    const [plats] = await db.query(sql, params);
    res.json(plats);
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function addPlat(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const { nom, description, prix, categorie } = req.body;

  if (!nom || !prix) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const [resultat] = await db.query(
      "INSERT INTO menu (nom, description, prix, categorie) VALUES (?, ?, ?, ?)",
      [nom, description, prix, categorie],
    );

    console.log("[NOTIFICATION] Nouveau plat ajouté au menu : " + nom);

    res.json({ message: "Plat ajouté", id: resultat.insertId });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function updatePlat(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const id = req.params.id;
  const { nom, description, prix, categorie } = req.body;

  try {
    const [plats] = await db.query("SELECT * FROM menu WHERE id = ?", [id]);

    if (plats.length === 0) {
      return res.status(404).json({ message: "Plat introuvable" });
    }

    await db.query(
      "UPDATE menu SET nom=?, description=?, prix=?, categorie=? WHERE id=?",
      [nom, description, prix, categorie, id],
    );

    console.log("[NOTIFICATION] Plat #" + id + " modifié");

    res.json({ message: "Plat modifié" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function deletePlat(req, res) {
  if (!req.utilisateur.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const id = req.params.id;

  try {
    const [plats] = await db.query("SELECT * FROM menu WHERE id = ?", [id]);

    if (plats.length === 0) {
      return res.status(404).json({ message: "Plat introuvable" });
    }

    await db.query("DELETE FROM menu WHERE id=?", [id]);

    console.log("[NOTIFICATION] Plat #" + id + " supprimé du menu");

    res.json({ message: "Plat supprimé" });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  getMenu,
  addPlat,
  updatePlat,
  deletePlat,
};
