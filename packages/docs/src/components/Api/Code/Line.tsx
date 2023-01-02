import React, {ReactNode, useLayoutEffect, useRef} from 'react';

import styles from './styles.module.css';
import clsx from 'clsx';

export default function Line({children}: {children?: ReactNode | ReactNode[]}) {
  const line = useRef<HTMLSpanElement>();

  useLayoutEffect(() => {
    if (!line.current) return;
    const parent = line.current.closest('pre');
    if (parent.scrollWidth > parent.clientWidth) {
      const lists: HTMLElement[] = Array.from(
        line.current.querySelectorAll(`.${styles.elements}`),
      );

      const multiple = lists.filter(list => list.children.length > 1);
      while (parent.scrollWidth > parent.clientWidth && lists.length > 0) {
        if (multiple.length > 0) {
          multiple.shift().classList.add(styles.wrap);
        } else {
          lists.shift().classList.add(styles.wrap);
        }
      }
    }
  });

  return (
    <>
      {children && (
        <span ref={line} className={clsx(styles.line, 'token-line')}>
          {children}
        </span>
      )}
      <br />
    </>
  );
}
