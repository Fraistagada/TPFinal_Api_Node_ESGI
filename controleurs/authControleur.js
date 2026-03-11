const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database");

// get in the .env file
require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;

async function signup(req, res) {
  const { email, motDePasse } = req.body;

  try {
    const [utilisateur] = await db.query(
      "SELECT id FROM utilisateurs WHERE email = ?",
      [email],
    );

    if (utilisateur.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hash = await bcrypt.hash(motDePasse, 10);

    await db.query(
      "INSERT INTO utilisateurs (email, mot_de_passe) VALUES (?, ?)",
      [email, hash],
    );

    res.json({ message: "Compte créé" });
  } catch (erreur) {
    res.status(500).json({ message: erreur.message });
  }
}

async function login(req, res) {
  const { email, motDePasse } = req.body;

  try {
    const [utilisateurs] = await db.query(
      "SELECT * FROM utilisateurs WHERE email = ?",
      [email],
    );

    if (utilisateurs.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const utilisateur = utilisateurs[0];

    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.mot_de_passe,
    );

    if (!motDePasseValide) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { id: utilisateur.id, email: utilisateur.email },
      jwt_secret,
      { expiresIn: "24h" },
    );

    res.json({ token });
  } catch (erreur) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { signup, login };
