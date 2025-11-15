import { useState, useCallback } from "react";

/**
 * Custom hook for API calls with loading and error states
 */
export function useApi(apiFunction) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...args);
        return result;
      } catch (err) {
        const errorMessage = err.message || "Something went wrong";
        setError(errorMessage);
        console.error("API Error:", errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const clearError = useCallback(() => setError(null), []);

  return { execute, loading, error, clearError };
}
