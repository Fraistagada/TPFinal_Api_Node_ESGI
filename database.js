const mysql = require("mysql2");

const connexion = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "eval_api",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = connexion.promise();
