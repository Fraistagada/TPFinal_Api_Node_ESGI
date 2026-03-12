const express = require("express");
const router = express.Router();

const { getMenu } = require("../controleurs/menuControleur");

router.get("/menu", getMenu);

module.exports = router;