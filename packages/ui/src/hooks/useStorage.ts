import {useCallback, useMemo, useState} from 'preact/hooks';
import {useApplication} from '../contexts';

export function useStorage<T>(
  id: string,
  initialState: T = null,
): [T, (newState: T) => void, boolean] {
  const name = useApplication().project.name;
  const key = `${name}-${id}`;
  const [savedState, wasLoaded] = useMemo(() => {
    const savedState = localStorage.getItem(key);
    return savedState ? [JSON.parse(savedState), true] : [initialState, false];
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

  return [state, updateState, wasLoaded];
}
