import {MutableRef, useEffect, useMemo, useState} from 'preact/hooks';

export function useSize<T extends Element>(
  ref: MutableRef<T>,
): DOMRectReadOnly {
  const [rect, setRect] = useState<DOMRect>(new DOMRect());
  const observer = useMemo(
    () => new ResizeObserver(entries => setRect(entries[0].contentRect)),
    [],
  );
  useEffect(() => {
    const {current} = ref;
    observer.observe(current);
    return () => observer.unobserve(current);
  }, [ref.current]);

  return rect;
}
