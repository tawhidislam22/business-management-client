import { useState, useEffect } from "react";

const useDebounce = (value, delay, debug = false) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (debug) {
      console.log(`Value changed: ${value}`);
    }

    // Validate delay
    if (typeof delay !== "number" || delay < 0) {
      console.error("Delay must be a positive number.");
      return;
    }

    // If the value is empty, update immediately without debouncing
    if (value === "") {
      if (debug) {
        console.log("Value is empty, updating immediately.");
      }
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      if (debug) {
        console.log(`Debounced value updated: ${value}`);
      }
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, debug]);

  return debouncedValue;
};

export default useDebounce;