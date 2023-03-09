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
        node.addEventListener('mouseover', handleMouseOverWrapper);
        node.addEventListener('mouseout', handleMouseOutWrapper);

        return () => {
          node.removeEventListener('mouseover', handleMouseOverWrapper);
          node.removeEventListener('mouseout', handleMouseOutWrapper);
        };
      }
    },
    [ref.current], // Recall only if ref changes
  );

  return [ref, value];
}
