import React, { useState, useEffect } from "react";
import {
  Folder,
  Star,
  Timer,
  CheckCircle2,
  Trash2,
  Binary,
  Atom,
  Trees,
  Server,
  Database,
  Layers,
  Plus,
  Menu,
  X,
  AlertCircle,
  Trash,
  RotateCcw,
} from "lucide-react";
import * as categoryApi from "../utils/categoryApi.js";

// Default categories with their icons and colors
const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Questions", icon: Folder, color: "indigo" },
  { id: "starred", name: "Starred", icon: Star, color: "yellow" },
  { id: "revision", name: "Today's Revision", icon: Timer, color: "red" },
  { id: "completed", name: "Completed", icon: CheckCircle2, color: "emerald" },
  { id: "trash", name: "Trash", icon: Trash2, color: "slate" },
];

function Sidebar({ activeCategory, onSelectCategory, onAddSection, isMobileOpen, onCloseMobile, currentUser }) {
  const [customCategories, setCustomCategories] = useState([]);
  const [trashedCategories, setTrashedCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Load categories on mount only if user is logged in
  useEffect(() => {
    if (currentUser) {
      loadCategories();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // Load trashed categories when Trash is selected
  useEffect(() => {
    if (activeCategory === "trash" && currentUser) {
      loadTrashedCategories();
    }
  }, [activeCategory, currentUser]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await categoryApi.getCategories();
      setCustomCategories(categories);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  const loadTrashedCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await categoryApi.getTrashedCategories();
      setTrashedCategories(categories);
    } catch (err) {
      console.error("Failed to load trashed categories:", err);
      setError("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;

    try {
      setError(null);
      const newCategory = await categoryApi.createCategory(
        newSectionName,
        "Folder",
        "indigo"
      );
      setCustomCategories([...customCategories, newCategory]);
      setNewSectionName("");
      setShowAddModal(false);
      onAddSection?.(newCategory);
    } catch (err) {
      console.error("Failed to create category:", err);
      setError(err.response?.data?.message || "Failed to create section");
    }
  };

  const handleDeleteSection = async (id) => {
    if (!confirm("Delete this section? Questions will move to trash.")) return;

    try {
      setDeleting(id);
      setError(null);
      await categoryApi.deleteCategory(id);
      setCustomCategories(customCategories.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError("Failed to delete section");
    } finally {
      setDeleting(null);
    }
  };

  const handleRestoreCategory = async (id) => {
    try {
      setDeleting(id);
      setError(null);
      await categoryApi.restoreCategory(id);
      setTrashedCategories(trashedCategories.filter((cat) => cat.id !== id));
      // Reload regular categories in case the restored one should be visible
      await loadCategories();
    } catch (err) {
      console.error("Failed to restore category:", err);
      setError("Failed to restore section");
    } finally {
      setDeleting(null);
    }
  };

  const handlePermanentlyDeleteCategory = async (id) => {
    if (!confirm("Permanently delete this section and its questions? This cannot be undone.")) return;

    try {
      setDeleting(id);
      setError(null);
      await categoryApi.permanentlyDeleteCategory(id);
      setTrashedCategories(trashedCategories.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Failed to permanently delete category:", err);
      setError("Failed to delete section");
    } finally {
      setDeleting(null);
    }
  };

  const handleCategoryClick = (categoryId) => {
    onSelectCategory(categoryId);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto transition-transform duration-300 z-40 md:relative md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">StudyPro</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Study Smart
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Categories Section */}
        <div className="px-3 py-4">
          <div className="px-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
            Main Categories
          </div>
          <div className="space-y-1">
            {DEFAULT_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="px-3 my-2">
          <div className="h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Custom Sections OR Trash Items */}
        <div className="px-3 py-4">
          <div className="px-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
            {activeCategory === "trash" ? "Trash" : "Study Sections"}
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {loading ? (
            <div className="px-2 py-3 text-xs text-slate-500 dark:text-slate-400">
              {activeCategory === "trash" ? "Loading trash..." : "Loading sections..."}
            </div>
          ) : activeCategory === "trash" ? (
            // Show trash contents
            trashedCategories.length === 0 ? (
              <div className="px-2 py-3 text-xs text-slate-500 dark:text-slate-400">
                Trash is empty
              </div>
            ) : (
              <div className="space-y-1">
                {trashedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all duration-200 group text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div className="flex-1 text-sm font-medium">{category.name}</div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => handleRestoreCategory(category.id)}
                        disabled={deleting === category.id}
                        className="p-1.5 rounded hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 text-slate-500"
                        title="Restore"
                      >
                        {deleting === category.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <RotateCcw size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handlePermanentlyDeleteCategory(category.id)}
                        disabled={deleting === category.id}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-slate-500"
                        title="Permanently delete"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : customCategories.length === 0 ? (
            <div className="px-2 py-3 text-xs text-slate-500 dark:text-slate-400">
              No sections yet. Create one!
            </div>
          ) : (
            <div className="space-y-1">
              {customCategories.map((category) => {
                const colorDot = {
                  blue: "bg-blue-500",
                  cyan: "bg-cyan-500",
                  green: "bg-green-500",
                  red: "bg-red-500",
                  emerald: "bg-emerald-500",
                  indigo: "bg-indigo-500",
                  yellow: "bg-yellow-500",
                  slate: "bg-slate-500",
                }[category.color] || "bg-indigo-500";

                const isActive = activeCategory === category.slug;

                return (
                  <div
                    key={category.id}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all duration-200 group ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <button
                      onClick={() => handleCategoryClick(category.slug)}
                      className="flex-1 flex items-center gap-3 text-left"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${colorDot}`} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSection(category.id)}
                      disabled={deleting === category.id}
                      className={`p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all ${
                        deleting === category.id
                          ? "opacity-100 cursor-not-allowed"
                          : isActive
                          ? "text-white hover:bg-red-600/30"
                          : "text-slate-500 dark:text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                      }`}
                      title="Move section to trash"
                    >
                      {deleting === category.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash size={16} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add New Section Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mt-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 border-2 border-dashed border-slate-300 dark:border-slate-700"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Add New Section</span>
          </button>
        </div>
      </aside>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Section</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-800 dark:text-red-300 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Section Name
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g., System Design"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === "Enter" && handleAddSection()}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSectionName("");
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSection}
                  disabled={!newSectionName.trim() || loading}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Section"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
