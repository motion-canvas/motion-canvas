import {useEffect, useState} from 'preact/hooks';

const MediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(MediaQuery.matches);
  useEffect(() => {
    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    MediaQuery.addEventListener('change', handler);
    return () => MediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
