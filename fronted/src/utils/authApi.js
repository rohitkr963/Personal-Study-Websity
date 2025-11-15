import axios from "axios";
import { setAuthToken as setQuestionAuth } from "../api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const authClient = axios.create({ baseURL: `${API_BASE_URL}/api/auth` });

function saveUserToStorage(user) {
  try {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  } catch (e) {}
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function register(payload) {
  const res = await authClient.post("/register", payload);
  const data = res.data;
  if (data && data.token) {
    setQuestionAuth(data.token);
    saveUserToStorage(data.user || null);
  }
  return data;
}

export async function login(payload) {
  const res = await authClient.post("/login", payload);
  const data = res.data;
  if (data && data.token) {
    setQuestionAuth(data.token);
    saveUserToStorage(data.user || null);
  }
  return data;
}

export function logout() {
  setQuestionAuth(null);
  saveUserToStorage(null);
}

export default { register, login, logout, getCurrentUser };
