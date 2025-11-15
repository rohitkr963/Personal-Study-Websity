import axios from "axios";

const client = axios.create({
  baseURL: "/api/questions",
});

// attach token from localStorage if present
const token = localStorage.getItem("authToken");
if (token) {
  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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

export async function getQuestions() {
  const res = await client.get("/");
  return res.data || [];
}

export async function createQuestion(payload) {
  const res = await client.post("/", payload);
  return res.data;
}

export async function updateQuestion(id, updates) {
  const res = await client.put(`/${id}`, updates);
  return res.data;
}

export async function toggleDone(id) {
  const res = await client.patch(`/${id}/toggle`);
  return res.data;
}

export async function markReviewed(id) {
  const res = await client.patch(`/${id}/review`);
  return res.data;
}

export async function toggleStar(id) {
  const res = await client.patch(`/${id}/star`);
  return res.data;
}

export async function removeQuestion(id) {
  const res = await client.delete(`/${id}`);
  return res.data;
}
