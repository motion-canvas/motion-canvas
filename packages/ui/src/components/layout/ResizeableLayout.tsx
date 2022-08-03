import styles from './ResizeableLayout.module.scss';

import {ComponentChild, JSX} from 'preact';
import {useCallback, useMemo, useRef} from 'preact/hooks';
import {classes} from '../../utils';
import {useDrag, useStorage} from '../../hooks';

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
  size = 0.3,
  id = null,
  resizeable = true,
}: ResizeableLayoutProps) {
  const [currentSize, setSize] = useStorage(`${id}-layout-size`, size);
  const containerRef = useRef<HTMLDivElement>();

  const [handleDrag] = useDrag(
    useCallback(
      (dx, dy, x, y) => {
        const rect = containerRef.current.getBoundingClientRect();
        setSize(
          vertical ? (y - rect.y) / rect.height : (x - rect.x) / rect.width,
        );
      },
      [vertical, setSize],
    ),
  );

  const style = useMemo<JSX.CSSProperties>(() => {
    if (!resizeable) return {};
    return vertical
      ? {height: `${currentSize * 100}%`}
      : {width: `${currentSize * 100}%`};
  }, [currentSize, vertical, resizeable]);

  return (
    <div
      ref={containerRef}
      className={classes(
        styles.root,
        [styles.vertical, vertical],
        [styles.resizeable, resizeable],
      )}
    >
      <div className={styles.left} style={style}>
        {start}
      </div>
      <div onMouseDown={handleDrag} className={styles.separator} />
      <div className={styles.right}>{end}</div>
    </div>
  );
}
