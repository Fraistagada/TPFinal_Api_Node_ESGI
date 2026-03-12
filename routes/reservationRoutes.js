const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addReservation,
  updateReservation,
  deleteReservation,
  validateReservation,
  getReservations
} = require("../controleurs/reservationControleur");

router.post("/reservations", authMiddleware, addReservation);
router.get("/reservations", authMiddleware, getReservations);
router.put("/reservations/:id", authMiddleware, updateReservation);
router.delete("/reservations/:id", authMiddleware, deleteReservation);
router.patch("/reservations/:id/validate", authMiddleware, validateReservation);

module.exports = router;
