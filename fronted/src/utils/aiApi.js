import { client } from '../api';
import API_BASE_URL from '../config/api.config.js';

// Use absolute URLs for AI endpoints because the main API client baseURL
// is currently pointed at the questions subpath.
const AI_BASE = `${API_BASE_URL}/api/ai`;

export async function generateAnswer(question) {
  const res = await client.post(`${AI_BASE}/answer`, { question });
  return res.data;
}

export async function generateTags(question, maxTags = 3) {
  const res = await client.post(`${AI_BASE}/tags`, { question, maxTags });
  return res.data.tags;
}

export async function detectDifficulty(question) {
  const res = await client.post(`${AI_BASE}/difficulty`, { question });
  return res.data.difficulty;
}
