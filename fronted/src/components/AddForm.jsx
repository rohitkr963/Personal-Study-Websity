import React, { useState } from "react";
import { validateQuestion } from "../utils/validation.js";

function AddForm({ onSubmit, category = "all" }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [categoryState, setCategoryState] = useState(category || "all");
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    
    const payload = { question, answer, tags, difficulty, category: categoryState };
    
    // Validate before submitting
    const validationErrors = validateQuestion(payload);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    onSubmit({ question: question.trim(), answer: answer.trim(), tags, difficulty, category: categoryState });
    
    // Reset form
    setQuestion("");
    setAnswer("");
    setTagsText("");
    setDifficulty("medium");
    setCategoryState(category || "all");
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Add New Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Question *</label>
          <textarea
            className={`w-full rounded-lg border bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.question
                ? "border-red-400 dark:border-red-600"
                : "border-slate-300 dark:border-slate-700"
            }`}
            rows={2}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (errors.question) setErrors({ ...errors, question: null });
            }}
            placeholder="What is your question?"
          />
          {errors.question && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.question}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Answer / Notes</label>
          <textarea
            className={`w-full rounded-lg border bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.answer
                ? "border-red-400 dark:border-red-600"
                : "border-slate-300 dark:border-slate-700"
            }`}
            rows={4}
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (errors.answer) setErrors({ ...errors, answer: null });
            }}
            placeholder="Add your answer or notes..."
          />
          {errors.answer && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.answer}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              className={`w-full rounded-lg border bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.tags
                  ? "border-red-400 dark:border-red-600"
                  : "border-slate-300 dark:border-slate-700"
              }`}
              placeholder="React, API, JavaScript (max 10)"
              value={tagsText}
              onChange={(e) => {
                setTagsText(e.target.value);
                if (errors.tags) setErrors({ ...errors, tags: null });
              }}
            />
            {errors.tags && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.tags}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            {/* Category select: reuse app study sections */}
            <select
              className="w-full rounded-lg border bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
              value={categoryState}
              onChange={(e) => setCategoryState(e.target.value)}
            >
              <option value="all">All Questions</option>
              <option value="dsa">DSA – JavaScript</option>
              <option value="react">React</option>
              <option value="nodejs">Node.js</option>
              <option value="express">Express</option>
              <option value="mongodb">MongoDB</option>
              <option value="javascript">JavaScript</option>
              <option value="interviews">Interviews</option>
            </select>
          </div>

          <div className="flex items-end justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <span>Add Question</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddForm;
