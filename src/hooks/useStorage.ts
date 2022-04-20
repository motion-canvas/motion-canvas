import {useCallback, useMemo, useState} from 'preact/hooks';

export function useStorage<T>(
  id: string,
  initialState?: T,
): [T, (newState: T) => void] {
  const savedState = useMemo(() => {
    const savedState = localStorage.getItem(id);
    return savedState ? JSON.parse(savedState) : null;
  }, [id]);
  const [state, setState] = useState<T>(savedState ?? initialState ?? null);

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
