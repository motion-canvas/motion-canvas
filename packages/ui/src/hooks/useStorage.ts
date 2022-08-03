import {useCallback, useMemo, useState} from 'preact/hooks';
import {usePlayer} from './usePlayer';

export function useStorage<T>(
  id: string,
  initialState: T = null,
): [T, (newState: T) => void] {
  const name = usePlayer().project.name;
  const key = `${name}-${id}`;
  const savedState = useMemo(() => {
    const savedState = localStorage.getItem(key);
    return savedState ? JSON.parse(savedState) : initialState;
  }, [key]);
  const [state, setState] = useState<T>(savedState);

  const updateState = useCallback(
    (newState: T) => {
      if (key) {
        localStorage.setItem(key, JSON.stringify(newState));
      }
      setState(newState);
    },
    [setState, key],
  );

  return [state, updateState];
}
