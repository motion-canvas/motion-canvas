import styles from './ResizeableLayout.module.scss';

import {ComponentChild, JSX} from 'preact';
import {useCallback, useMemo, useRef, useState} from 'preact/hooks';
import {classes} from '../../utils';
import {useDocumentEvent, useStorage} from '../../hooks';

interface ResizeableLayoutProps {
  start: ComponentChild;
  end: ComponentChild;
  vertical?: boolean;
  size?: number;
  id?: string;
  resizeable?: boolean;
}

export function ResizeableLayout({
  start,
  end,
  vertical = false,
  size = 540,
  id = null,
  resizeable = true,
}: ResizeableLayoutProps) {
  const [isMoving, setMoving] = useState<boolean>(false);
  const [currentSize, setSize] = useStorage(`${id}-layout-size`, size);
  const containerRef = useRef<HTMLDivElement>();

  useDocumentEvent(
    'mouseup',
    useCallback(() => setMoving(false), [setMoving]),
    isMoving,
  );
  useDocumentEvent(
    'mousemove',
    useCallback(
      (event: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setSize(vertical ? event.y - rect.y : event.x - rect.x);
      },
      [containerRef.current, vertical, setSize],
    ),
    isMoving,
  );

  const style = useMemo<JSX.CSSProperties>(() => {
    if (!resizeable) return {};
    return vertical
      ? {height: `${currentSize}px`}
      : {width: `${currentSize}px`};
  }, [currentSize, vertical, resizeable]);

  return (
    <div
      className={classes(
        styles.root,
        [styles.vertical, vertical],
        [styles.resizeable, resizeable],
      )}
    >
      <div ref={containerRef} className={styles.left} style={style}>
        {start}
      </div>
      <div
        onMouseDown={e => {
          e.preventDefault();
          setMoving(resizeable);
        }}
        className={styles.separator}
      />
      <div className={styles.right}>{end}</div>
    </div>
  );
}
