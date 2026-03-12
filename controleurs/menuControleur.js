const db = require("../database");

async function getMenu(req, res) {
  try {
    const [plats] = await db.query("SELECT * FROM menu");
    res.json(plats);
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = {
  getMenu,
};
