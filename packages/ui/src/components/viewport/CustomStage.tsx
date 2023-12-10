import type {Stage} from '@motion-canvas/core';
import {useLayoutEffect, useRef} from 'preact/hooks';
import {useSharedSettings} from '../../hooks';

import clsx from 'clsx';
import styles from './Viewport.module.scss';

export interface CustomStageProps {
  stage: Stage;
}

export function CustomStage({stage}: CustomStageProps) {
  const ref = useRef<HTMLDivElement>();
  const settings = useSharedSettings();

  useLayoutEffect(() => {
    ref.current.append(stage.finalBuffer);
    return () => stage.finalBuffer.remove();
  }, [stage]);

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
