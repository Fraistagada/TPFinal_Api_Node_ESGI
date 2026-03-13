const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTables,
  addTable,
  updateTable,
  deleteTable,
  getDisponibilites,
} = require("../controleurs/tableControleur");

router.get("/tables", getTables);
router.post("/tables", authMiddleware, addTable);
router.put("/tables/:id", authMiddleware, updateTable);
router.delete("/tables/:id", authMiddleware, deleteTable);
router.get("/disponibilites", getDisponibilites);

module.exports = router;
