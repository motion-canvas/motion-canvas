import {useApplication} from '../../contexts';
import {useLayoutEffect, useRef} from 'preact/hooks';
import {useSharedSettings} from '../../hooks';

import styles from './Viewport.module.scss';
import clsx from 'clsx';

export function RenderingPreview() {
  const {renderer} = useApplication();
  const ref = useRef<HTMLDivElement>();
  const settings = useSharedSettings();

  useLayoutEffect(() => {
    ref.current.append(renderer.stage.finalBuffer);
    return () => renderer.stage.finalBuffer.remove();
  }, []);

  return (
    <div
      className={clsx(
        styles.viewport,
        styles.renderingPreview,
        settings.background ? styles.canvasOutline : styles.alphaBackground,
      )}
      ref={ref}
    />
  );
}
