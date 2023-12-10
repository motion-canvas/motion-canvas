import React, {ReactNode, useLayoutEffect, useRef} from 'react';

import clsx from 'clsx';
import styles from './styles.module.css';

function compare(a: number, b: number) {
  return a > b ? 1 : a < b ? -1 : 0;
}

export default function Line({children}: {children?: ReactNode | ReactNode[]}) {
  const line = useRef<HTMLSpanElement>();

  useLayoutEffect(() => {
    if (!line.current) return;
    const parent = line.current.closest('pre');
    if (parent.scrollWidth > parent.clientWidth) {
      const lists: HTMLElement[] = Array.from(
        line.current.querySelectorAll<HTMLElement>(`.${styles.elements}`),
      ).sort((a, b) => compare(b.innerText.length, a.innerText.length));

      while (parent.scrollWidth > parent.clientWidth && lists.length > 0) {
        lists.shift().classList.add(styles.wrap);
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
