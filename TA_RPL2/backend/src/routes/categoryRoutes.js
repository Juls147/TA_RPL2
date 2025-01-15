const express = require("express");
const categoryController = require("../controllers/categoryController");
const authenticateToken = require("../middlewares/auth");
const router = express.Router();

router.post("/", authenticateToken, categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", authenticateToken, categoryController.updateCategoryById);
router.delete("/:id", authenticateToken, categoryController.deleteCategory);

module.exports = router;
