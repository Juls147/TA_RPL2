const express = require("express");
const router = express.Router();
const { handleWebhook } = require("../webhook/webhookController");

router.post("/", handleWebhook);

module.exports = router;
