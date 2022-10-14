import { useEffect, useState } from "react";

function useLocalState(defaultVal, key) {
  const [val, setVal] = useState(() => {
    const localStorageVal = localStorage.getItem(key);

    return localStorageVal !== null ? JSON.parse(localStorageVal) : defaultVal;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);

  return [val, setVal];
}

export { useLocalState };
