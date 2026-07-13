const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");
const { createConfig, editConfig, getConfig } = require("../controllers/config.controller");

const router = express.Router();

router.get("/:item", getConfig);
router.post("/create", requireAdmin, createConfig);
router.put("/:id", requireAdmin, editConfig);

module.exports = router;
