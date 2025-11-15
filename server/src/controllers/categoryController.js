const Category = require("../models/Category");
const Question = require("../models/Question");

// Get all categories for user (excluding trashed)
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const categories = await Category.find({ owner: userId, trashed: false }).sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const { name, icon, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Create slug from name
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    // Check if slug already exists for this user
    const existing = await Category.findOne({ owner: userId, slug });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name,
      slug,
      icon: icon || "Folder",
      color: color || "indigo",
      owner: userId,
      order: await Category.countDocuments({ owner: userId }),
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete category (soft delete to trash). Do NOT mark questions as trashed.
exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const { id } = req.params;

    const category = await Category.findOne({ _id: id, owner: userId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.isDefault) {
      return res.status(400).json({ message: "Cannot delete default categories" });
    }

    // Soft-delete the category only. Questions should keep their `category` field
    // so they will re-appear in the category when it is restored.
    await Category.findByIdAndUpdate({ _id: id }, { trashed: true });

    res.json({ message: "Category moved to trash (questions preserved)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update category order
exports.updateCategoryOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const { categories } = req.body; // array of {id, order}

    for (const cat of categories) {
      await Category.findOneAndUpdate(
        { _id: cat.id, owner: userId },
        { order: cat.order }
      );
    }

    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get trashed categories for user
exports.getTrashedCategories = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const categories = await Category.find({ owner: userId, trashed: true }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Restore category from trash. Questions are preserved and will be visible again
// when the category becomes non-trashed because their `category` field was not changed.
exports.restoreCategory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const { id } = req.params;

    const category = await Category.findOne({ _id: id, owner: userId, trashed: true });
    if (!category) {
      return res.status(404).json({ message: "Trashed category not found" });
    }

    // Restore category only; questions were preserved when the category was trashed.
    await Category.findByIdAndUpdate({ _id: id }, { trashed: false });

    res.json({ message: "Category restored from trash (questions preserved)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Permanently delete trashed category (and its questions)
exports.permanentlyDeleteCategory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const { id } = req.params;

    const category = await Category.findOne({ _id: id, owner: userId, trashed: true });
    if (!category) {
      return res.status(404).json({ message: "Trashed category not found" });
    }

    // Permanently delete questions in this category (delete all regardless of trashed flag)
    const categorySlug = category.slug;
    await Question.deleteMany({ owner: userId, category: categorySlug });

    // Permanently delete the category
    await Category.deleteOne({ _id: id });

    res.json({ message: "Category and its questions permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

