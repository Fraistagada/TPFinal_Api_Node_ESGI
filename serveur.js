const express = require("express");
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const menuRoutes = require("./routes/menuRoutes");

const app = express();

app.use(express.json());

app.use("/", authRoutes);
app.use("/", reservationRoutes);
app.use("/", menuRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
});
