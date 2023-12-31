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
    const handleBlur = () => {
      setHeld(false);
    };

    document.addEventListener('keydown', handleDown, true);
    document.addEventListener('keyup', handleUp, true);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('contextmenu', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleDown, true);
      document.removeEventListener('keyup', handleUp, true);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('contextmenu', handleBlur);
    };
  }, [key]);

  return isHeld;
}
