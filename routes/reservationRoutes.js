const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { creerReservation } = require("../controleurs/reservationControleur");
const { getReservations } = require("../controleurs/reservationControleur");
const { getMyReservations } = require("../controleurs/reservationControleur");

router.post("/reservations", authMiddleware, creerReservation);
router.get("/reservations", authMiddleware, getReservations);
router.get("/my-reservations", authMiddleware, getMyReservations);

module.exports = router;
