const mysql = require("mysql2");
require("dotenv").config();

const connexion = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "eval_api",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = connexion.promise();
