import React, { useState } from "react";
import { Menu, Plus, Search, Settings, Play } from "lucide-react";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";

function TopBar({ 
  title, 
  stats, 
  onAddClick, 
  onMenuClick,
  onSettingsClick,
  onStartStudy,
  search,
  onSearchChange,
  currentUser,
  onLogout,
}) {
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Left: Title & Stats */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {stats && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Total: {stats.total} • Completed: {stats.completed} • Pending: {stats.pending}
            </p>
          )}
        </div>

        {/* Right: Search & Add Button */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block flex-1 max-w-xs">
            <SearchBar value={search} onChange={onSearchChange} />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => { if (currentUser) { onStartStudy && onStartStudy(); } else { navigate('/login'); } }}
              title="Start Study Session"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
            >
              <Play size={16} />
              <span className="text-sm">Study</span>
            </button>

            <button
              onClick={() => { if (currentUser) { onAddClick && onAddClick(); } else { navigate('/login'); } }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={18} />
              <span className="font-medium">Add</span>
            </button>

            <button
              onClick={() => { if (currentUser) { onSettingsClick && onSettingsClick(); } else { navigate('/login'); } }}
              title="Settings"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <Settings size={16} />
            </button>
            {/* User info + Logout */}
            {currentUser ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="text-sm text-slate-700 dark:text-slate-200 px-3 py-2 rounded-full bg-slate-50 dark:bg-slate-800">
                  {currentUser.name ? currentUser.name : currentUser.email}
                </div>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2 relative">
                <button
                  onClick={() => setShowAuthMenu((s) => !s)}
                  title="Sign in or sign up"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Sign in / Sign up
                </button>
                {showAuthMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-lg z-30">
                    <button
                      onClick={() => { setShowAuthMenu(false); navigate("/login"); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Sign in
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800" />
                    <button
                      onClick={() => { setShowAuthMenu(false); navigate("/signup"); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <Menu size={24} className="text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-4">
        <SearchBar value={search} onChange={onSearchChange} />
      </div>
    </div>
  );
}

export default TopBar;
