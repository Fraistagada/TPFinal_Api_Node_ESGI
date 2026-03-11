const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/", authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
});
