import React, {useEffect, useRef, useState} from 'react';

type UseHoverType<T extends HTMLElement> = [React.RefObject<T>, boolean];

export function useHover<T extends HTMLElement>(
  handleMouseOver?: () => void,
  handleMouseOut?: () => void,
): UseHoverType<T> {
  const [value, setValue] = useState(false);

  const ref = useRef<T>(null);

  const _handleMouseOver = () => {
    setValue(true);
    handleMouseOver?.();
  };

  const _handleMouseOut = () => {
    setValue(false);
    handleMouseOut?.();
  };

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseover', _handleMouseOver);
        node.addEventListener('mouseout', _handleMouseOut);

        return () => {
          node.removeEventListener('mouseover', _handleMouseOver);
          node.removeEventListener('mouseout', _handleMouseOut);
        };
      }
    },
    [ref.current], // Recall only if ref changes
  );

  return [ref, value];
}
