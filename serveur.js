const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const menuRoutes = require("./routes/menuRoutes");
const tableRoutes = require("./routes/tableRoutes");
const creneauRoutes = require("./routes/creneauRoutes");

const app = express();

app.use(express.json());

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", authRoutes);
app.use("/", reservationRoutes);
app.use("/", menuRoutes);
app.use("/", tableRoutes);
app.use("/", creneauRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
  console.log("Documentation Swagger : http://localhost:" + PORT + "/api-docs");
});
