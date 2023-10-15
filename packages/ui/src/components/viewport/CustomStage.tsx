import type {Stage} from '@motion-canvas/core';
import {useLayoutEffect, useRef, Ref} from 'preact/hooks';
import {useSharedSettings} from '../../hooks';
import React, {ComponentProps} from 'react';

import styles from './Viewport.module.scss';
import clsx from 'clsx';
import { CustomStageOverlay } from './CustomStageOverlay';
import {useApplication} from '../../contexts';
import type {ReactElement} from 'react';

export interface CustomStageProps {
  stage: Stage,
  forwardRef?: Ref<HTMLDivElement>,
  showOverlay?: boolean
}

const heyTest = ()  => {
  return <div>"HEYYY"</div>
}

export function CustomStage({stage, forwardRef, showOverlay=false} : CustomStageProps) {
  const settings = useSharedSettings();
  const {customStageOverlay} = useApplication();

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
        {customStageOverlay({showOverlay:showOverlay, content: heyTest()})}
      {/* <CustomStageOverlay showOverlay={showOverlay} /> */}
    </div>
  );
}


