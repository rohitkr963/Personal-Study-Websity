import React, { useState } from "react";

function TagList({ tags, selectedTag, onSelectTag }) {
  const [customTag, setCustomTag] = useState("");

  function handleAddCustom(e) {
    e.preventDefault();
    const tag = customTag.trim();
    if (!tag) return;
    onSelectTag(tag);
    setCustomTag("");
  }

  return (
    <div className="text-xs">
      <div className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
        Tags
      </div>
      <div className="flex flex-wrap gap-1 px-1 mb-2">
        <button
          type="button"
          onClick={() => onSelectTag(null)}
          className={`px-2 py-1 rounded-full border text-[11px] ${
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
            className={`px-2 py-1 rounded-full border text-[11px] ${
              selectedTag === tag
                ? "bg-sky-600 text-white border-sky-600"
                : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <form onSubmit={handleAddCustom} className="flex items-center gap-1 px-1">
        <input
          type="text"
          placeholder="Add new tag"
          className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1 text-[11px]"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
        />
        <button
          type="submit"
          className="px-2 py-1 rounded-md text-[11px] border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default TagList;
