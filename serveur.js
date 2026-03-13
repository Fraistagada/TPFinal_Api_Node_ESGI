const express = require("express");
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const menuRoutes = require("./routes/menuRoutes");
const tableRoutes = require("./routes/tableRoutes");
const creneauRoutes = require("./routes/creneauRoutes");

const app = express();

app.use(express.json());

app.use("/", authRoutes);
app.use("/", reservationRoutes);
app.use("/", menuRoutes);
app.use("/", tableRoutes);
app.use("/", creneauRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
});
