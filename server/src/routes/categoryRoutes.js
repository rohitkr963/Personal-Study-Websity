const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticateRequired } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authenticateRequired);

// Trash related routes MUST come before /:id routes to avoid conflicts
router.get("/trash/all", categoryController.getTrashedCategories);
router.patch("/trash/restore/:id", categoryController.restoreCategory);
router.delete("/trash/permanent/:id", categoryController.permanentlyDeleteCategory);

// Regular category routes
router.get("/", categoryController.getCategories);
router.post("/", categoryController.createCategory);
router.delete("/:id", categoryController.deleteCategory);
router.patch("/order", categoryController.updateCategoryOrder);

module.exports = router;
