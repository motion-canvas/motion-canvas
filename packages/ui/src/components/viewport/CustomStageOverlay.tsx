import { useRef } from 'preact/hooks';

import styles from './Viewport.module.scss';
import clsx from 'clsx';
import {useEffect, useState} from 'react';
import { JSXInternal } from 'preact/src/jsx';

export interface CustomStageOverlayProps {
  showOverlay?: boolean,
  content?: JSXInternal.Element
}

export function CustomStageOverlay(props?: CustomStageOverlayProps, callbacks?: any) {
  const ref = useRef<HTMLDivElement>();
  const {showOverlay, content} = props;
  
  useEffect(() => {
    callbacks?.test();
  }, [showOverlay])
  return (
    <div 
      // style={{opacity: `${showOverlay ? 1 : 'none'}`}}
      className={clsx(styles.customStageOverlay, !showOverlay && styles.hidden)}
      ref={ref}>
        <div className={clsx(styles.overlayContainer)}>{content}</div>

      </div>
  );
}

export type {CustomStageOverlayProps as CustomStageOverlayPropsType}

