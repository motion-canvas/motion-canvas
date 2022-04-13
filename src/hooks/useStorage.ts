import { useCallback, useState } from "preact/hooks";

export function useStorage<T>(
  id: string,
  initialState?: T,
): [T, (newState: T) => void] {
  if (id) {
    const savedState = localStorage.getItem(id);
    if (savedState) {
      initialState = JSON.parse(savedState);
    }
  }
  const [state, setState] = useState<T>(initialState ?? null);

  const updateState = useCallback(
    (newState: T) => {
      if (id) {
        localStorage.setItem(id, JSON.stringify(newState));
      }
      setState(newState);
    },
    [setState, id],
  );

  return [state, updateState];
}