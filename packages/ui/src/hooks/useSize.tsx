import {MutableRef, useEffect, useMemo, useState} from 'preact/hooks';

export function useSize<T extends Element>(
  ref: MutableRef<T>,
): DOMRectReadOnly {
  const [rect, setRect] = useState<DOMRect>(new DOMRect());
  const observer = useMemo(
    () =>
      new ResizeObserver(() => setRect(ref.current.getBoundingClientRect())),
    [],
  );
  useEffect(() => {
    const {current} = ref;
    observer.observe(current);
    return () => observer.unobserve(current);
  }, [ref.current]);

  return rect;
}
