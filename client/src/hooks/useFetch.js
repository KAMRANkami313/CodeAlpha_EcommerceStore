import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for data fetching with abort support.
 *
 * IMPORTANT: Pass a STABLE function reference (e.g., wrapped in useCallback)
 * as apiCall, NOT an inline arrow function. Inline arrows create new references
 * on every render, causing infinite re-fetch loops.
 *
 * ✅ Correct:   useFetch(useCallback(() => service.getById(id), [id]))
 * ❌ Wrong:     useFetch(() => service.getById(id), [id])
 */
const useFetch = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const execute = useCallback(async () => {
    // Abort any in-flight request from a previous call
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      // Pass the abort signal to the API call so axios can cancel the request
      const response = await apiCall(controller.signal);
      // Ignore result if the request was aborted
      if (controller.signal.aborted) return;
      setData(response.data);
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, dependencies);

  useEffect(() => {
    execute();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

export default useFetch;