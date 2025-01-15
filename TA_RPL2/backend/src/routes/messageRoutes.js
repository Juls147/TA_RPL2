const express = require("express");
const messageController = require("../controllers/messageController");
const authenticateToken = require("../middlewares/auth");
const router = express.Router();

router.post("/", authenticateToken, messageController.createMessage);
router.get("/", authenticateToken, messageController.getMessages);
router.get(
  "/message/:username",
  authenticateToken,
  messageController.getMessageByName
);
router.get("/:id", authenticateToken, messageController.getMessageById);
router.delete("/:id", authenticateToken, messageController.deleteMessageById);
router.delete(
  "/message/:username",
  authenticateToken,
  messageController.deleteMessageByName
);
router.post(
  "/arrived/:orderId",
  authenticateToken,
  messageController.createArrivedMessage
);
// router.put("/:id", authenticateToken, messageController.updateMessage);

module.exports = router;
