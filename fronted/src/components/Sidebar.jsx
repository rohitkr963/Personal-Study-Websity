import React, { useState } from "react";
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
} from "lucide-react";

// Default categories with their icons and colors
const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Questions", icon: Folder, color: "indigo" },
  { id: "starred", name: "Starred", icon: Star, color: "yellow" },
  { id: "revision", name: "Today's Revision", icon: Timer, color: "red" },
  { id: "completed", name: "Completed", icon: CheckCircle2, color: "emerald" },
  { id: "trash", name: "Trash", icon: Trash2, color: "slate" },
];

const CUSTOM_CATEGORIES = [
  { id: "dsa", name: "DSA – JavaScript", icon: Binary, color: "blue" },
  { id: "react", name: "⚛️ React", icon: Atom, color: "cyan" },
  { id: "nodejs", name: "Node.js", icon: Trees, color: "green" },
  { id: "express", name: "Express", icon: Server, color: "red" },
  { id: "mongodb", name: "MongoDB", icon: Database, color: "emerald" },
];

function Sidebar({ activeCategory, onSelectCategory, onAddSection, isMobileOpen, onCloseMobile }) {
  const [customCategories, setCustomCategories] = useState(CUSTOM_CATEGORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;

    const newCategory = {
      id: newSectionName.toLowerCase().replace(/\s+/g, "-"),
      name: newSectionName,
      icon: Folder,
      color: "indigo",
    };

    setCustomCategories([...customCategories, newCategory]);
    setNewSectionName("");
    setShowAddModal(false);
    onAddSection?.(newCategory);
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

        {/* Custom Sections */}
        <div className="px-3 py-4">
          <div className="px-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
            Study Sections
          </div>
          <div className="space-y-1">
            {customCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
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

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${colorDot}`} />
                  <span className="text-sm font-medium flex-1">{category.name}</span>
                </button>
              );
            })}
          </div>

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
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSectionName("");
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSection}
                  disabled={!newSectionName.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Create Section
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
