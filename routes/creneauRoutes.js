const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getCreneaux,
  addCreneau,
  updateCreneau,
  deleteCreneau,
} = require("../controleurs/creneauControleur");

router.get("/creneaux", getCreneaux);
router.post("/creneaux", authMiddleware, addCreneau);
router.put("/creneaux/:id", authMiddleware, updateCreneau);
router.delete("/creneaux/:id", authMiddleware, deleteCreneau);

module.exports = router;
