const express = require("express");
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/auth");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/user/create", authenticateToken, userController.createUser);
router.get("/user/usertype", authenticateToken, userController.getUserType);
router.get("/user/alluser", authenticateToken, userController.getAllUsers);
router.get("/user/getuser/:id", authenticateToken, userController.getUserById);
router.put("/:id", authenticateToken, userController.updateUserById);
router.delete("/:id", authenticateToken, userController.deleteUserById);
router.get("/user/messages", authenticateToken, userController.getMessages);

module.exports = router;
