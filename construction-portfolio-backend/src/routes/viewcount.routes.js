const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");
const { editCount, getAllViews } = require("../controllers/viewcount.controller");

const router = express.Router();

router.put("/edit", editCount);
router.get("/all", requireAdmin, getAllViews);

module.exports = router;
