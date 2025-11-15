import axios from "axios";
import API_BASE_URL from "../config/api.config.js";
import tokenManager from "./tokenManager.js";

const categoryClient = axios.create({
  baseURL: `${API_BASE_URL}/api/categories`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request dynamically
categoryClient.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setAuthToken(token) {
  tokenManager.setToken(token);
}

export async function getCategories() {
  try {
    const res = await categoryClient.get("/");
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    throw err;
  }
}

export async function createCategory(name, icon = "Folder", color = "indigo") {
  try {
    const res = await categoryClient.post("/", { name, icon, color });
    return res.data;
  } catch (err) {
    console.error("Failed to create category:", err);
    throw err;
  }
}

export async function deleteCategory(id) {
  try {
    const res = await categoryClient.delete(`/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete category:", err);
    throw err;
  }
}

export async function updateCategoryOrder(categories) {
  try {
    const res = await categoryClient.patch("/order", { categories });
    return res.data;
  } catch (err) {
    console.error("Failed to update category order:", err);
    throw err;
  }
}

export async function getTrashedCategories() {
  try {
    const res = await categoryClient.get("/trash/all");
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch trashed categories:", err);
    throw err;
  }
}

export async function restoreCategory(id) {
  try {
    const res = await categoryClient.patch(`/trash/restore/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to restore category:", err);
    throw err;
  }
}

export async function permanentlyDeleteCategory(id) {
  try {
    const res = await categoryClient.delete(`/trash/permanent/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to permanently delete category:", err);
    throw err;
  }
}

export default { getCategories, createCategory, deleteCategory, updateCategoryOrder, getTrashedCategories, restoreCategory, permanentlyDeleteCategory };
