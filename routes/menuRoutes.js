const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getMenu, addPlat, updatePlat, deletePlat } = require("../controleurs/menuControleur");

router.get("/menu", getMenu);
router.post("/menu", authMiddleware, addPlat);
router.put("/menu/:id", authMiddleware, updatePlat);
router.delete("/menu/:id", authMiddleware, deletePlat);

module.exports = router;
