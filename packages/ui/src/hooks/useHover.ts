import React, {useEffect, useRef, useState} from 'react';

type UseHoverType<T extends HTMLElement> = [React.RefObject<T>, boolean];

export function useHover<T extends HTMLElement>(
  handleMouseOver?: () => void,
  handleMouseOut?: () => void,
): UseHoverType<T> {
  const [value, setValue] = useState(false);

  const ref = useRef<T>(null);

  const handleMouseOverWrapper = () => {
    setValue(true);
    handleMouseOver?.();
  };

  const handleMouseOutWrapper = () => {
    setValue(false);
    handleMouseOut?.();
  };

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseenter', handleMouseOverWrapper);
        node.addEventListener('mouseleave', handleMouseOutWrapper);

        return () => {
          node.removeEventListener('mouseenter', handleMouseOverWrapper);
          node.removeEventListener('mouseleave', handleMouseOutWrapper);
        };
      }
    },
    [ref.current], // Recall only if ref changes
  );

  return [ref, value];
}
