import useIsBrowser from '@docusaurus/useIsBrowser';
import {useCallback, useMemo, useState} from 'react';

export default function useStorage<T>(key: string, initialState: T) {
  const isBrowser = useIsBrowser();
  const savedState = useMemo(() => {
    const savedState = isBrowser && localStorage.getItem(key);
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (_) {
        localStorage.removeItem(key);
      }
    }
    return initialState;
  }, [key]);
  const [state, setState] = useState<T>(savedState);

  const updateState = useCallback(
    (newState: T) => {
      if (key && isBrowser) {
        localStorage.setItem(key, JSON.stringify(newState));
      }
      setState(newState);
    },
    [setState, key],
  );

  return [state, updateState];
}
