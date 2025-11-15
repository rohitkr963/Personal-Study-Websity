// Validation utilities for form inputs

export const validators = {
  question: (text) => {
    if (!text || !text.trim()) {
      return "Question is required";
    }
    if (text.trim().length > 1000) {
      return "Question must be less than 1000 characters";
    }
    return null;
  },

  answer: (text) => {
    if (text && text.trim().length > 5000) {
      return "Answer must be less than 5000 characters";
    }
    return null;
  },

  tags: (tags) => {
    if (Array.isArray(tags) && tags.length > 10) {
      return "Maximum 10 tags allowed";
    }
    return null;
  },

  difficulty: (value) => {
    const valid = ["easy", "medium", "hard"];
    if (value && !valid.includes(value)) {
      return "Invalid difficulty level";
    }
    return null;
  },
};

export function validateQuestion(question) {
  const errors = {};

  if (question.question) {
    const qError = validators.question(question.question);
    if (qError) errors.question = qError;
  }

  if (question.answer) {
    const aError = validators.answer(question.answer);
    if (aError) errors.answer = aError;
  }

  if (question.tags) {
    const tError = validators.tags(question.tags);
    if (tError) errors.tags = tError;
  }

  if (question.difficulty) {
    const dError = validators.difficulty(question.difficulty);
    if (dError) errors.difficulty = dError;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
