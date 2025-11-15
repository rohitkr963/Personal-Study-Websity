const KEY = "study_advanced";
const META_KEY = "study_advanced_meta";

export const save = (data) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save to localStorage", err);
  }
};

export const load = () => {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load from localStorage", err);
    return [];
  }
};

export const saveMeta = (meta) => {
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch (err) {
    console.error("Failed to save meta", err);
  }
};

export const loadMeta = () => {
  try {
    const raw = window.localStorage.getItem(META_KEY);
    if (!raw) return { streak: 0, lastActiveDate: null, dailyGoal: 20 };
    const parsed = JSON.parse(raw);
    return {
      streak: parsed.streak || 0,
      lastActiveDate: parsed.lastActiveDate || null,
      dailyGoal: parsed.dailyGoal || 20,
    };
  } catch (err) {
    console.error("Failed to load meta", err);
    return { streak: 0, lastActiveDate: null, dailyGoal: 20 };
  }
};
