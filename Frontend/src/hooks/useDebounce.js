import { useRef, useEffect, useCallback } from "react";

export default function useDebounce(callback, delay = 300) {
  const timeoutRef = useRef(null);
  const cbRef = useRef(callback);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  const debounced = useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      try {
        cbRef.current(...args);
      } catch (err) {
        console.error("useDebounce: callback error", err);
      }
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debounced;
}
