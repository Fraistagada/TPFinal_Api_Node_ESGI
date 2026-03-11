const jwt = require("jsonwebtoken");

// get in the .env file
require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = header.split(" ")[1];

  try {
    const utilisateur = jwt.verify(token, jwt_secret);

    req.utilisateur = utilisateur;

    next();
  } catch (erreur) {
    res.status(403).json({ message: "Token invalide" });
  }
}

module.exports = authMiddleware;
