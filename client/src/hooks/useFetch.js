import { useState, useEffect, useCallback, useRef } from 'react';

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
      const response = await apiCall();
      // Ignore result if the request was aborted (component unmounted or deps changed)
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

    // Cleanup: abort the request when component unmounts or deps change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

export default useFetch;