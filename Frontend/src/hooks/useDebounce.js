import { useRef } from "react";

export default function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  const debouncedFunction = (...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };

  return debouncedFunction;
}
