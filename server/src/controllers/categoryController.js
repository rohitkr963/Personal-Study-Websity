const Category = require("../models/Category");

// Get all categories for user
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const categories = await Category.find({ owner: userId }).sort({ order: 1 });
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

// Delete category
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

    await Category.deleteOne({ _id: id });
    res.json({ message: "Category deleted" });
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
