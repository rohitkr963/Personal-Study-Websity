import React from "react";

function TagSelector({ tags, selectedTag, onSelectTag }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
      <span className="mr-1 text-slate-500">Tags:</span>
      <button
        type="button"
        onClick={() => onSelectTag(null)}
        className={`px-2 py-0.5 rounded-full border transition-colors ${
          selectedTag === null
            ? "bg-slate-900 text-slate-50 border-slate-900"
            : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelectTag(tag)}
          className={`px-2 py-0.5 rounded-full border transition-colors ${
            selectedTag === tag
              ? "bg-sky-600 text-white border-sky-600"
              : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default TagSelector;
