import React, { useRef } from "react";

function ImportExport({ onExport, onImport }) {
  const fileRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        onImport(data);
      } catch (err) {
        console.error(err);
        alert("Invalid JSON file");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="text-xs space-y-2">
      <div className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Backup
      </div>
      <div className="flex flex-wrap gap-2 px-1">
        <button
          type="button"
          onClick={onExport}
          className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Import JSON
        </button>
      </div>
      <input
        type="file"
        accept="application/json"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default ImportExport;
