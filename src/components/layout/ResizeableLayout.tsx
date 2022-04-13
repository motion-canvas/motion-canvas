import styles from './ResizeableLayout.module.scss';

import {ComponentChild, ComponentChildren} from 'preact';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import {classes} from '../../utils';
import {useDocumentEvent, useStorage} from '../../hooks';

interface ResizeableLayoutProps {
  left: ComponentChild;
  right: ComponentChild;
  vertical?: boolean;
  size?: number;
  id?: string;
}

export function ResizeableLayout({
  left,
  right,
  vertical = false,
  size = 540,
  id = null,
}: ResizeableLayoutProps) {
  const [isMoving, setMoving] = useState<boolean>(false);
  const [currentSize, setSize] = useStorage(`${id}-layout-size`, size);
  const leftRef = useRef<HTMLDivElement>();

  useDocumentEvent(
    'mouseup',
    useCallback(() => setMoving(false), [setMoving]),
    isMoving,
  );
  useDocumentEvent(
    'mousemove',
    useCallback(
      (event: MouseEvent) => {
        if (!leftRef.current) return;
        const leftRect = leftRef.current.getBoundingClientRect();
        const parentRect =
          leftRef.current.parentElement.getBoundingClientRect();
        setSize(vertical ? event.y - leftRect.y : event.x - leftRect.x);
      },
      [leftRef.current, vertical, setSize],
    ),
    isMoving,
  );

  return (
    <div className={classes(styles.root, [styles.vertical, vertical])}>
      <div
        ref={leftRef}
        className={styles.left}
        style={
          vertical ? {height: `${currentSize}px`} : {width: `${currentSize}px`}
        }
      >
        {left}
      </div>
      <div
        onMouseDown={e => {
          e.preventDefault();
          setMoving(true);
        }}
        className={styles.separator}
      />
      <div className={styles.right}>{right}</div>
    </div>
  );
}
