import type {Stage} from '@motion-canvas/core';
import {useLayoutEffect, useRef, Ref} from 'preact/hooks';
import {useSharedSettings} from '../../hooks';
import React, {ComponentProps} from 'react';

import styles from './Viewport.module.scss';
import clsx from 'clsx';
import { CustomStageOverlay } from './CustomStageOverlay';

export interface CustomStageProps {
  stage: Stage,
  forwardRef?: Ref<HTMLDivElement>
}

export function CustomStage({stage, forwardRef} : CustomStageProps) {
  const settings = useSharedSettings();

  useLayoutEffect(() => {
    forwardRef.current.append(stage.finalBuffer);
    return () => stage.finalBuffer.remove();
  }, [stage]);

  return (
    <div
      className={clsx(
        styles.viewport,
        styles.renderingPreview,
        settings.background ? styles.canvasOutline : styles.alphaBackground,
      )}
      ref={forwardRef}>
        <CustomStageOverlay />
      </div>
  );
}


