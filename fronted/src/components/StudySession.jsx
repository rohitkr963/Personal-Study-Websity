import React, { useEffect, useState, useRef } from "react";

function StudySession({ items = [], onClose, onMarkDone }) {
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const intervalRef = useRef(null);

  const current = items[index];

  useEffect(() => {
    setSeconds(60);
  }, [index]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (seconds <= 0) {
      if (autoAdvance) {
        handleNext();
      } else {
        setRunning(false);
      }
    }
  }, [seconds]);

  const handleNext = () => {
    setRunning(false);
    setTimeout(() => {
      setRunning(true);
      setIndex((i) => Math.min(i + 1, items.length - 1));
    }, 300);
  };

  const handlePrev = () => {
    setIndex((i) => Math.max(0, i - 1));
    setSeconds(60);
  };

  const handleMarkDone = async () => {
    if (!current) return;
    try {
      await onMarkDone?.(current.id);
    } catch (e) {
      // ignore
    }
  };

  if (!current) return (
    <div className="p-6">
      <div className="text-center">No questions for study session.</div>
      <div className="mt-4 flex justify-center">
        <button onClick={onClose} className="px-4 py-2 rounded bg-indigo-600 text-white">Close</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 w-full max-w-2xl">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">Study Session</h3>
        <div className="text-sm text-slate-500">{index + 1} / {items.length}</div>
      </div>

      <div className="border rounded-xl p-6 bg-white dark:bg-slate-900">
        <div className="text-sm text-slate-500 mb-2">Time left</div>
        <div className="text-4xl font-bold mb-4">{Math.max(0, seconds)}</div>

        <div className="mb-4">
          <div className="text-base font-semibold mb-2">{current.question}</div>
          {current.answer && <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{current.answer}</div>}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handlePrev} disabled={index===0} className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-800">Prev</button>
          <button onClick={handleNext} disabled={index===items.length-1} className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-800">Next</button>
          <button onClick={handleMarkDone} className="px-3 py-2 rounded bg-emerald-600 text-white">Mark Done</button>
          <button onClick={() => setRunning((r) => !r)} className="px-3 py-2 rounded bg-indigo-600 text-white">{running ? 'Pause' : 'Resume'}</button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm">Auto-advance</label>
          <input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded border">Close</button>
      </div>
    </div>
  );
}

export default StudySession;
