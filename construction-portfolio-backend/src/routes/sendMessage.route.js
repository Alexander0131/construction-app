const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");
const { sendMessage, getMessages } = require("../controllers/sendmail.controller");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/", requireAdmin, getMessages);

module.exports = router;
