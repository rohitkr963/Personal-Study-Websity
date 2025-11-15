const express = require("express");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", categoryController.getCategories);
router.post("/", categoryController.createCategory);
router.delete("/:id", categoryController.deleteCategory);
router.patch("/order", categoryController.updateCategoryOrder);

module.exports = router;
