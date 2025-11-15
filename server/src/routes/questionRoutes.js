const express = require("express");
const {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  toggleDone,
  reviewQuestion,
  toggleStar,
} = require("../controllers/questionController");
const { authenticateOptional, authenticateRequired } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes: allow public browsing of questions (optional auth)
router.get("/", authenticateOptional, getQuestions);
router.post("/", authenticateRequired, addQuestion);
router.put("/:id", authenticateRequired, updateQuestion);
router.delete("/:id", authenticateRequired, deleteQuestion);

router.patch("/:id/toggle", authenticateRequired, toggleDone);
router.patch("/:id/review", authenticateRequired, reviewQuestion);
router.patch("/:id/star", authenticateRequired, toggleStar);

module.exports = router;
