import styles from './ResizeableLayout.module.scss';

import {Signal} from '@preact/signals';
import clsx from 'clsx';
import {ComponentChild} from 'preact';
import {useRef} from 'preact/hooks';
import {useStorage} from '../../hooks';
import {clamp} from '../../utils';

interface ResizeableLayoutProps {
  id: string;
  vertical?: boolean;
  hidden: Signal<boolean>;
  offset?: number;
  children: [ComponentChild, ComponentChild];
}

export function ResizeableLayout({
  id,
  children: [start, end],
  vertical = false,
  offset = 0,
  hidden,
}: ResizeableLayoutProps) {
  const inverse = offset < 0;
  const containerRef = useRef<HTMLDivElement>();
  const [size, setSize] = useStorage(`${id}-layout-size`, inverse ? 1 : 0);
  const dimension = vertical ? 'height' : 'width';
  const axis = vertical ? 'y' : 'x';

  return (
    <div
      ref={containerRef}
      className={clsx(styles.root, {
        [styles.vertical]: vertical,
        [styles.hidden]: hidden.value,
      })}
    >
      <div
        className={styles.left}
        style={{
          [dimension]: hidden.value
            ? undefined
            : `calc(${offset}px + ${size * 100}%)`,
        }}
      >
        {start}
      </div>
      <div
        className={styles.separator}
        onPointerDown={event => {
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            const rect = containerRef.current.getBoundingClientRect();
            const pixels = event[axis] - rect[axis];
            hidden.value = inverse
              ? rect[dimension] - pixels < -offset / 2
              : pixels < offset / 2;
            const percentage = clamp(0, 1, (pixels - offset) / rect[dimension]);
            setSize(percentage);
          }
        }}
        onPointerUp={event => {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
      />
      <div className={styles.right}>{end}</div>
    </div>
  );
}
