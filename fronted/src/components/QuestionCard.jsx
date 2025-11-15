import React, { useState } from "react";
import { Star, StarOff, Edit3, Trash2, CheckCircle2 } from "lucide-react";

function difficultyColor(level) {
  if (level === "easy") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (level === "hard") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

function QuestionCard({ item, onToggleDone, onEdit, onDelete, onStar, onReview }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const created = item.createdAt ? new Date(item.createdAt) : null;
  const createdLabel = created ? created.toLocaleDateString() : "";

  return (
    <article className="border border-slate-200/70 dark:border-slate-800/80 bg-surface/95 dark:bg-surface-dark/95 rounded-2xl px-4 py-3.5 text-sm flex gap-3 shadow-soft-sm hover:shadow-soft-card hover:-translate-y-[1px] transition-all duration-300 ease-out">
      <div className="flex flex-col items-center pt-1">
        <button
          type="button"
          onClick={onToggleDone}
          className={`h-6 w-6 rounded-full border flex items-center justify-center text-[11px] transition-colors ${
            item.done
              ? "border-success bg-success text-white"
              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-slate-400"
          }`}
        >
          {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
        </button>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={`font-medium leading-snug truncate ${
                  item.done ? "line-through text-slate-500" : "text-slate-900 dark:text-slate-50"
                }`}
              >
                {item.question}
              </h3>
              {item.starred && (
                <Star className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
              )}
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {/* Category badge for debugging / visibility */}
            {item.category && (
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full px-2 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {String(item.category).charAt(0).toUpperCase() + String(item.category).slice(1)}
                </span>
              {
                // revisionStatus is passed when in revision view
              }
              </div>
            )}

            {/** If parent passes revisionStatus prop, show label **/}
            {typeof item.revisionStatus !== "undefined" && (
              <div className="mt-2">
                {item.revisionStatus === "reviewed" ? (
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-[11px] bg-purple-50 text-purple-700 border border-purple-200">Reviewed now</span>
                ) : item.revisionStatus === "due" ? (
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-[11px] bg-rose-50 text-rose-700 border border-rose-200">Due</span>
                ) : null}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 text-[11px] text-slate-500">
            {createdLabel && <span>Added: {createdLabel}</span>}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-[2px] ${difficultyColor(
                item.difficulty
              )}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span className="capitalize">{item.difficulty || "medium"}</span>
            </span>
          </div>
        </div>

        {item.answer && (
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setShowAnswer((v) => !v)}
              className="text-[11px] text-primary hover:text-primary/80 font-medium"
            >
              {showAnswer ? "Hide answer" : "Show answer"}
            </button>
            {showAnswer && (
              <p className="mt-1 text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                {item.answer}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Level: {item.reviewLevel || 1}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={onStar}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {item.starred ? (
                <>
                  <StarOff className="h-3.5 w-3.5" />
                  <span>Unstar</span>
                </>
              ) : (
                <>
                  <Star className="h-3.5 w-3.5" />
                  <span>Star</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onReview}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Review done</span>
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-rose-300 text-rose-600 bg-rose-50/60 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default QuestionCard;
