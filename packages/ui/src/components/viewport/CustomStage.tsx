import type {Stage} from '@motion-canvas/core';
import {useLayoutEffect, useRef, Ref} from 'preact/hooks';
import {useSharedSettings} from '../../hooks';
import React, {ComponentProps} from 'react';

import styles from './Viewport.module.scss';
import clsx from 'clsx';
import { CustomStageOverlay } from './CustomStageOverlay';
import {ComponentChildren} from 'preact';
import {JSX} from 'preact';

export interface CustomStageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: ComponentChildren,
  stage: Stage,
  forwardRef?: Ref<HTMLDivElement>,
  keyPressed?: string
}

export function CustomStage({stage, forwardRef, children, keyPressed} : CustomStageProps) {
  const settings = useSharedSettings();
  // const {customStageOverlay} = useApplication();

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

        <CustomStageOverlay keyPressed={keyPressed}> {children} </CustomStageOverlay>
    </div>
  );
}


