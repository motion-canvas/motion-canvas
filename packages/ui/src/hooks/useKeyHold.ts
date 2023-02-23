import {useEffect, useState} from 'preact/hooks';

export function useKeyHold(key: string) {
  const [isHeld, setHeld] = useState(false);

  useEffect(() => {
    const handleDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        setHeld(true);
      }
    };
    const handleUp = (event: KeyboardEvent) => {
      if (event.key === key) {
        setHeld(false);
      }
    };

    document.addEventListener('keydown', handleDown, true);
    document.addEventListener('keyup', handleUp, true);

    return () => {
      document.removeEventListener('keydown', handleDown, true);
      document.removeEventListener('keyup', handleUp, true);
    };
  }, [key]);

  return isHeld;
}
