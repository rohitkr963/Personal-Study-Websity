import axios from "axios";
import API_BASE_URL from "../config/api.config.js";

const categoryClient = axios.create({
  baseURL: `${API_BASE_URL}/api/categories`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage
const token = localStorage.getItem("authToken");
if (token) {
  categoryClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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

export default { getCategories, createCategory, deleteCategory, updateCategoryOrder };
