const Question = require("../models/Question");

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

// GET /api/questions
async function getQuestions(req, res, next) {
  try {
    // Public browsing: if authenticated, return user's questions plus public (ownerless) ones;
    // if unauthenticated, return only public (ownerless) questions so browsing works without login.
    let query;
    if (req.user && req.user.id) {
      query = { $or: [{ owner: req.user.id }, { owner: { $exists: false } }, { owner: null }] };
    } else {
      query = { $or: [{ owner: { $exists: false } }, { owner: null }] };
    }
    const questions = await Question.find(query).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    next(err);
  }
}

// POST /api/questions
async function addQuestion(req, res, next) {
  try {
    const {
      question,
      answer,
      tags,
      difficulty,
      starred,
      done,
      category,
      reviewLevel,
      lastReviewed,
      collection,
    } = req.body;

    // Validation
    if (!question || !question.trim()) {
      res.status(400);
      throw new Error("Question text is required");
    }

    if (question.trim().length > 1000) {
      res.status(400);
      throw new Error("Question must be less than 1000 characters");
    }

    const normalizedTags = normalizeTags(tags);

    const doc = await Question.create({
      question: question.trim(),
      answer: answer || "",
      tags: normalizedTags,
      difficulty: difficulty || "medium",
      starred: !!starred,
      done: !!done,
      category: category || "all",
      owner: req.user && req.user.id ? req.user.id : undefined,
      reviewLevel: reviewLevel || 1,
      lastReviewed: lastReviewed ? new Date(lastReviewed) : Date.now(),
      collection: collection || "default",
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

// PUT /api/questions/:id
async function updateQuestion(req, res, next) {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) {
      res.status(404);
      throw new Error("Question not found");
    }

    // Only owner may update
    if (!q.owner || !req.user || q.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Not authorized to update this question");
    }

    const {
      question,
      answer,
      tags,
      difficulty,
      starred,
      done,
      category,
      reviewLevel,
      lastReviewed,
      collection,
    } = req.body;

    if (typeof question === "string") q.question = question.trim();
    if (typeof answer === "string") q.answer = answer;

    if (tags !== undefined) {
      q.tags = normalizeTags(tags);
    }

    if (difficulty) q.difficulty = difficulty;
    if (typeof starred === "boolean") q.starred = starred;
    if (typeof done === "boolean") q.done = done;
    if (category) q.category = category;
    if (reviewLevel !== undefined) q.reviewLevel = reviewLevel;
    if (lastReviewed !== undefined) q.lastReviewed = new Date(lastReviewed);
    if (collection) q.collection = collection;

    const updated = await q.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/questions/:id
async function deleteQuestion(req, res, next) {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) {
      res.status(404);
      throw new Error("Question not found");
    }

    // Only owner may delete
    if (!q.owner || !req.user || q.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Not authorized to delete this question");
    }

    await q.deleteOne();
    res.json({ message: "Question removed" });
  } catch (err) {
    next(err);
  }
}

// PATCH helpers (extra features)

async function toggleDone(req, res, next) {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) {
      res.status(404);
      throw new Error("Question not found");
    }

    // Only owner may toggle
    if (!q.owner || !req.user || q.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Not authorized to modify this question");
    }

    q.done = !q.done;
    const updated = await q.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function reviewQuestion(req, res, next) {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) {
      res.status(404);
      throw new Error("Question not found");
    }

    // Only owner may mark reviewed
    if (!q.owner || !req.user || q.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Not authorized to modify this question");
    }

    const level = q.reviewLevel || 1;
    q.reviewLevel = Math.min(level + 1, 3);
    q.lastReviewed = new Date();
    const updated = await q.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function toggleStar(req, res, next) {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) {
      res.status(404);
      throw new Error("Question not found");
    }

    // Only owner may star/unstar
    if (!q.owner || !req.user || q.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Not authorized to modify this question");
    }

    q.starred = !q.starred;
    const updated = await q.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  toggleDone,
  reviewQuestion,
  toggleStar,
};
