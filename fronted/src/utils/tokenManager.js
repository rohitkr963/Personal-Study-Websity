// Centralized auth token management
class AuthTokenManager {
  constructor() {
    this.listeners = [];
  }

  getToken() {
    try {
      return localStorage.getItem("authToken") || null;
    } catch (e) {
      console.error("Error getting token:", e);
      return null;
    }
  }

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }
      // Notify all listeners
      this.listeners.forEach(listener => listener(token));
    } catch (e) {
      console.error("Error setting token:", e);
    }
  }

  clearToken() {
    this.setToken(null);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export default new AuthTokenManager();
