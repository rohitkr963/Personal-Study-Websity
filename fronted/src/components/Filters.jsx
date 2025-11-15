import React from "react";

function Filters({ filter, onFilterChange, sort, onSortChange }) {
  const filters = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "revision", label: "Revision" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-900/60 p-1">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilterChange(f.id)}
            className={`px-2.5 py-1 rounded-full border text-xs transition-colors ${
              filter === f.id
                ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-sm"
                : "border-transparent text-slate-600 dark:text-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-500">Sort</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1"
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">A 	- Z</option>
          <option value="za">Z 	- A</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
