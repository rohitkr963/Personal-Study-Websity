import axios from "axios";
import { apiConfig } from "./config/api.config.js";

const client = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// Attach token from localStorage if present
const existingToken = localStorage.getItem("authToken");
if (existingToken) {
  client.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

export function setAuthToken(token) {
  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("authToken", token);
  } else {
    delete client.defaults.headers.common["Authorization"];
    localStorage.removeItem("authToken");
  }
}

// Error interceptor for better error messages
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "An error occurred";
    console.error("API Error:", message);
    return Promise.reject({
      status: error.response?.status,
      message: message,
      data: error.response?.data,
    });
  }
);

export async function getQuestions() {
  try {
    const res = await client.get("/");
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch questions:", err);
    throw err;
  }
}

export async function addQuestion(payload) {
  try {
    if (!payload.question || !payload.question.trim()) {
      throw new Error("Question text is required");
    }
    const res = await client.post("/", payload);
    return res.data;
  } catch (err) {
    console.error("Failed to create question:", err);
    throw err;
  }
}

export async function updateQuestion(id, updates) {
  try {
    if (!id) throw new Error("Question ID is required");
    const res = await client.put(`/${id}`, updates);
    return res.data;
  } catch (err) {
    console.error("Failed to update question:", err);
    throw err;
  }
}

export async function deleteQuestion(id) {
  try {
    if (!id) throw new Error("Question ID is required");
    const res = await client.delete(`/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete question:", err);
    throw err;
  }
}

export async function toggleDone(id) {
  try {
    if (!id) throw new Error("Question ID is required");
    const res = await client.patch(`/${id}/toggle`);
    return res.data;
  } catch (err) {
    console.error("Failed to toggle question status:", err);
    throw err;
  }
}

export async function markReviewed(id) {
  try {
    if (!id) throw new Error("Question ID is required");
    const res = await client.patch(`/${id}/review`);
    return res.data;
  } catch (err) {
    console.error("Failed to mark question as reviewed:", err);
    throw err;
  }
}

export async function toggleStar(id) {
  try {
    if (!id) throw new Error("Question ID is required");
    const res = await client.patch(`/${id}/star`);
    return res.data;
  } catch (err) {
    console.error("Failed to toggle star:", err);
    throw err;
  }
}
export default { getQuestions, addQuestion, updateQuestion, deleteQuestion, toggleDone, markReviewed, toggleStar };
export { client };
