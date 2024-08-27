import {MutableRef, useEffect, useRef} from 'preact/hooks';

export function useClickOutside<T extends Element>(
  ref: MutableRef<T>,
  onClick: () => void,
) {
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;
  useEffect(() => {
    const handler = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickRef.current();
      }
    };

    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);
}
