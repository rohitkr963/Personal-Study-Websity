import React, { useEffect, useRef } from "react";

function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search questions or answers... (/ shortcut)"
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-950 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
      <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 border border-slate-300 dark:border-slate-600 rounded px-1">
        /
      </span>
    </div>
  );
}

export default SearchBar;
