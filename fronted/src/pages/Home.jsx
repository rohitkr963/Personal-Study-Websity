import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddForm from "../components/AddForm.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import TagList from "../components/TagList.jsx";
import ImportExport from "../components/ImportExport.jsx";
import StatsBar from "../components/StatsBar.jsx";
import TagSelector from "../components/TagSelector.jsx";
import RevisionPanel from "../components/RevisionPanel.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { load, save, loadMeta, saveMeta } from "../utils/storage.js";
import { getRevisionItems } from "../utils/revisionEngine.js";
import * as api from "../api.js";
import Dashboard from "../components/Dashboard.jsx";
import StudySession from "../components/StudySession.jsx";
import { getCurrentUser, logout as authLogout } from "../utils/authApi";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [selectedTag, setSelectedTag] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("questions");
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(() => loadMeta());
  const [notice, setNotice] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showStudy, setShowStudy] = useState(false);
  const [theme, setTheme] = useTheme();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Load questions on mount
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        setError(null);
        const serverItems = await api.getQuestions();
        if (!cancelled) {
          setItems(serverItems);
          save(serverItems);
        }
      } catch (err) {
        console.error("API load failed, using localStorage fallback", err);
        if (!cancelled) {
          setError("Using cached data - backend may be unavailable");
          const localItems = load();
          setItems(localItems);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  // Computed values
  const revisionDue = useMemo(() => getRevisionItems(items), [items]);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((it) => it.done).length;
    const active = total - completed;
    const completion = total ? Math.round((completed / total) * 100) : 0;

    const todayStr = new Date().toDateString();
    const todayCompleted = items.filter((it) => {
      if (!it.done || !it.updatedAt) return false;
      const d = new Date(it.updatedAt).toDateString();
      return d === todayStr;
    }).length;

    const revisionCount = revisionDue.length;

    return { total, completed, active, completion, todayCompleted, revisionCount };
  }, [items, revisionDue]);

  const allTags = useMemo(() => {
    const set = new Set();
    items.forEach((it) => {
      (it.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filteredItems = useMemo(() => {
    let list = [...items];

    // Compute recently reviewed IDs (within last 24 hours)
    const now = Date.now();
    // Consider an item "recently reviewed" only if lastReviewed is set AND
    // it's meaningfully later than createdAt. This prevents newly created items
    // (server may set lastReviewed default to now) from being treated as reviewed.
    const recentReviewedSet = new Set(
      items
        .filter((it) => it.lastReviewed)
        .filter((it) => {
          const last = Number(it.lastReviewed);
          const created = Number(it.createdAt) || 0;
          // require lastReviewed to be at least 5 seconds after createdAt
          if (last - created < 5000) return false;
          return now - last < 24 * 60 * 60 * 1000;
        })
        .map((it) => it.id)
    );

    // Filter by special categories first
    if (activeCategory && activeCategory !== "all") {
      const ac = String(activeCategory).toLowerCase();
      if (ac === "starred") {
        list = list.filter((it) => it.starred);
      } else if (ac === "completed") {
        list = list.filter((it) => it.done);
      } else if (ac === "revision") {
        // Show items that are due for revision OR were reviewed in the last 24 hours
        const revIds = new Set(revisionDue.map((r) => r.id));
        recentReviewedSet.forEach((id) => revIds.add(id));
        list = list.filter((it) => revIds.has(it.id));
      } else if (ac === "trash") {
        // Placeholder for trash flag; currently no trash implementation
        list = list.filter((it) => it.trashed);
      } else {
        // Treat as a study section/category
        list = list.filter((it) => String(it.category || "all").toLowerCase() === ac);
      }
    }

    // If we're NOT in the revision view, hide recently-reviewed items
    if (String(activeCategory).toLowerCase() !== "revision") {
      list = list.filter((it) => !recentReviewedSet.has(it.id));
    }

    if (selectedTag) {
      list = list.filter((it) => (it.tags || []).includes(selectedTag));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((it) => {
        const qText = (it.question || "").toLowerCase();
        const aText = (it.answer || "").toLowerCase();
        return qText.includes(q) || aText.includes(q);
      });
    }

    if (sort === "latest") {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sort === "oldest") {
      list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    } else if (sort === "az") {
      list.sort((a, b) => (a.question || "").localeCompare(b.question || ""));
    } else if (sort === "za") {
      list.sort((a, b) => (b.question || "").localeCompare(a.question || ""));
    }

    return list;
  }, [items, activeCategory, selectedTag, search, sort, revisionDue]);

  // DEBUG: log filtered items when activeCategory or filteredItems change
  React.useEffect(() => {
    try {
      const sample = filteredItems.map((it) => ({ id: it.id, category: it.category, done: !!it.done, lastReviewed: it.lastReviewed }));
      // Use console.debug so it doesn't pollute normal logs; user can enable verbose logging
      console.debug("[DEBUG] filteredItems summary:", { activeCategory, count: filteredItems.length, sample });
    } catch (e) {
      /* ignore */
    }
  }, [activeCategory, filteredItems]);

  const bumpStreakOnActivity = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    setMeta((prev) => {
      if (prev.lastActiveDate === today) return prev;
      let streak = prev.streak || 0;
      if (prev.lastActiveDate === yesterday) {
        streak += 1;
      } else {
        streak = 1;
      }
      const next = { ...prev, streak, lastActiveDate: today };
      saveMeta(next);
      return next;
    });
  };

  const handleAdd = async (data) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const created = await api.addQuestion(data);

      // Try to refresh the entire list from server to avoid stale localstate issues
      try {
        const serverItems = await api.getQuestions();
        // Normalize categories
        const normalized = serverItems.map((it) => ({ ...it, category: String(it.category || "all").toLowerCase() }));
        setItems(normalized);
        save(normalized);
      } catch (refreshErr) {
        // Fallback: ensure created has a normalized category and prepend
        if (!created.category) created.category = data.category || "all";
        created.category = String(created.category).toLowerCase();
        setItems((prev) => {
          const next = [created, ...prev];
          save(next);
          return next;
        });
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add question. Check console for details.");
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await api.updateQuestion(id, updates);
      setItems((prev) => {
        const next = prev.map((it) => {
          if (it.id !== id) return it;
          // preserve category if server doesn't return it
          const preservedCategory = (updated.category || it.category || "all").toString().toLowerCase();
          return { ...it, ...updated, category: preservedCategory };
        });
        save(next);
        return next;
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update question.");
    }
  };

  const handleToggleDone = async (id) => {
    try {
      const updated = await api.toggleDone(id);
      setItems((prev) => {
        const next = prev.map((it) => {
          if (it.id !== id) return it;
          const preservedCategory = (updated.category || it.category || "all").toString().toLowerCase();
          return { ...it, ...updated, category: preservedCategory };
        });
        save(next);

        // compute today's completed and show notice about daily goal
        try {
          const todayStr = new Date().toDateString();
          const todayCompletedCount = next.filter((it) => {
            if (!it.done || !it.updatedAt) return false;
            return new Date(it.updatedAt).toDateString() === todayStr;
          }).length;
          const dailyGoal = (meta && meta.dailyGoal) || 20;
          const remaining = Math.max(0, dailyGoal - todayCompletedCount);
          if (remaining > 0) {
            setNotice(`Daily goal: ${dailyGoal} — ${remaining} more to go today`);
          } else {
            setNotice(`Nice! You've hit your daily goal of ${dailyGoal} 🎉`);
          }
        } catch (e) {
          // ignore
        }

        return next;
      });
      if (updated.done) bumpStreakOnActivity();
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    }
  };

  const handleReview = async (id) => {
    try {
      const updated = await api.markReviewed(id);
      setItems((prev) => {
        const next = prev.map((it) => {
          if (it.id !== id) return it;
          const preservedCategory = (updated.category || it.category || "all").toString().toLowerCase();
          return { ...it, ...updated, category: preservedCategory };
        });
        save(next);
        return next;
      });
      // DEBUG: log review action and resulting item
      try {
        console.debug("[DEBUG] markReviewed:", { id, updated });
      } catch (e) {}
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to mark reviewed.");
    }
  };

  const handleStar = async (id) => {
    try {
      const updated = await api.toggleStar(id);
      setItems((prev) => {
        const next = prev.map((it) => {
          if (it.id !== id) return it;
          const preservedCategory = (updated.category || it.category || "all").toString().toLowerCase();
          return { ...it, ...updated, category: preservedCategory };
        });
        save(next);
        return next;
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update star.");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this question permanently?");
    if (!ok) return;
    try {
      await api.deleteQuestion(id);
      setItems((prev) => {
        const next = prev.filter((it) => it.id !== id);
        save(next);
        return next;
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete question.");
    }
  };

  const handleImport = async (imported) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!Array.isArray(imported)) {
      setError("Invalid import format: expected an array");
      return;
    }
    const ok = window.confirm(
      "Importing will ADD these questions on top of existing ones. Continue?"
    );
    if (!ok) return;

    try {
      const createdAll = [];
      for (const raw of imported) {
        if (!raw || !raw.question) continue;
        const payload = {
          question: raw.question,
          answer: raw.answer || "",
          tags: raw.tags || [],
          difficulty: raw.difficulty || "medium",
          starred: !!raw.starred,
          done: !!raw.done,
          reviewLevel: raw.reviewLevel || 1,
          lastReviewed: raw.lastReviewed || Date.now(),
          collection: raw.collection || "default",
        };
        const created = await api.addQuestion(payload);
        createdAll.push(created);
      }

      if (createdAll.length) {
        setItems((prev) => {
          const next = [...createdAll, ...prev];
          save(next);
          return next;
        });
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError("Import failed. Check console for details.");
    }
  };

  const handleExport = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const blob = new Blob([JSON.stringify(items, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `studypro-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Export failed. Check console for details.");
    }
  };

  const handleEditSave = (form) => {
    if (!editing) return;
    handleUpdate(editing.id, form);
    setEditing(null);
  };

  const getCategoryTitle = (category) => {
    const titles = {
      all: "All Questions",
      starred: "⭐ Starred Questions",
      revision: "🔥 Today's Revision",
      completed: "✅ Completed Questions",
      trash: "🗑️ Trash",
      dsa: "DSA – JavaScript",
      react: "⚛️ React",
      nodejs: "Node.js",
      express: "Express",
      mongodb: "MongoDB",
    };
    return titles[category] || "Questions";
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* New Sidebar */}
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* New Top Bar */}
        <TopBar
          title={getCategoryTitle(activeCategory)}
          stats={{
            total: items.length,
            completed: items.filter((it) => it.done).length,
            pending: items.filter((it) => !it.done).length,
          }}
          onAddClick={() => setShowAddForm(true)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onSettingsClick={() => setShowSettings(true)}
          onStartStudy={() => setShowStudy(true)}
          search={search}
          onSearchChange={setSearch}
          currentUser={currentUser}
          onLogout={() => {
            authLogout();
            setCurrentUser(null);
            navigate("/login");
          }}
        />

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                activeTab === "questions"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              📚 Questions
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                activeTab === "analytics"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              📊 Analytics
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {/* Dashboard Tab */}
          {activeTab === "analytics" ? (
            <Dashboard items={items} />
          ) : (
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300 flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Daily Goal Notice */}
            {notice && (
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200 flex items-center justify-between">
                <span>{notice}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNotice(null)}
                    className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <ProgressBar percent={stats.completion} total={stats.total} />

            {/* Filters & Tags */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm hover:border-slate-400"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">A → Z</option>
                    <option value="za">Z → A</option>
                  </select>
                </div>
                <div className="text-sm text-slate-500">
                  {filteredItems.length} / {stats.total} questions
                </div>
              </div>
              <TagSelector
                tags={allTags}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
              />
            </section>

            {/* Questions List */}
            <section className="space-y-3">
              {loading && (
                <div className="text-sm text-slate-500 text-center py-12">
                  Loading your questions...
                </div>
              )}
              {!loading && filteredItems.length === 0 && (
                <div className="text-sm text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center">
                  <p className="mb-2">No questions to show in this view.</p>
                  {search && " Try clearing your search."}
                </div>
              )}
              <div className="space-y-3">
                {filteredItems.map((item) => {
                  const isDue = revisionDue.some((r) => r.id === item.id);
                  const now = Date.now();
                  const recentlyReviewed = item.lastReviewed && (now - Number(item.lastReviewed) < 24 * 60 * 60 * 1000) && (Number(item.lastReviewed) - (Number(item.createdAt)||0) >= 5000);
                  const revisionStatus = isDue ? "due" : (recentlyReviewed ? "reviewed" : undefined);
                  const displayItem = { ...item, revisionStatus };
                  return (
                      <QuestionCard
                        key={item.id}
                        item={displayItem}
                        onToggleDone={() => {
                          if (!currentUser) return navigate('/login');
                          return handleToggleDone(item.id);
                        }}
                        onEdit={() => {
                          if (!currentUser) return navigate('/login');
                          return setEditing(item);
                        }}
                        onDelete={() => {
                          if (!currentUser) return navigate('/login');
                          return handleDelete(item.id);
                        }}
                        onStar={() => {
                          if (!currentUser) return navigate('/login');
                          return handleStar(item.id);
                        }}
                        onReview={() => {
                          if (!currentUser) return navigate('/login');
                          return handleReview(item.id);
                        }}
                      />
                    );
                })}
              </div>
            </section>
          </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {editing && (
        <EditModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 mx-4">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add New Question</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <AddForm 
                onSubmit={(data) => {
                  handleAdd(data);
                  setShowAddForm(false);
                }}
                category={activeCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 mx-4">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-500">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Daily Goal</label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2"
                  value={meta.dailyGoal || 20}
                  onChange={(e) => setMeta((m) => ({ ...m, dailyGoal: Number(e.target.value || 20) }))}
                />
                <p className="text-xs text-slate-500 mt-1">Minimum questions you aim to complete daily.</p>
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button
                  onClick={() => {
                    saveMeta(meta);
                    setShowSettings(false);
                    setNotice(`Daily goal set to ${meta.dailyGoal}`);
                  }}
                  className="px-4 py-2 rounded bg-indigo-600 text-white"
                >Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Study Session Modal */}
      {showStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="mx-4 w-full max-w-3xl">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold">Study Session</h3>
                <button onClick={() => setShowStudy(false)} className="text-slate-500">✕</button>
              </div>
              <div className="p-4">
                <StudySession
                  items={filteredItems.filter((it) => !it.done)}
                  onClose={() => setShowStudy(false)}
                  onMarkDone={async (id) => {
                    await handleToggleDone(id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditModal({ item, onClose, onSave }) {
  const [question, setQuestion] = useState(item.question || "");
  const [answer, setAnswer] = useState(item.answer || "");
  const [tagsText, setTagsText] = useState((item.tags || []).join(", "));
  const [difficulty, setDifficulty] = useState(item.difficulty || "medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ question: question.trim(), answer: answer.trim(), tags, difficulty });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold">Edit Question</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <label className="block text-xs font-medium mb-1">Question</label>
              <textarea
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-sm"
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Answer / Notes</label>
              <textarea
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-sm"
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Tags</label>
              <input
                type="text"
                placeholder="React, Auth, DSA"
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-sm"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Difficulty</label>
              <select
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-sm"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md text-xs bg-sky-600 text-white hover:bg-sky-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
