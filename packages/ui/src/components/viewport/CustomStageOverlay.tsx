import type {Stage} from '@motion-canvas/core';
import {useLayoutEffect, useRef} from 'preact/hooks';
import {useSharedSettings} from '../../hooks';

import styles from './Viewport.module.scss';
import clsx from 'clsx';

export interface CustomStageOverlayProps {
  stage?: Stage;
}

export function CustomStageOverlay(props : CustomStageOverlayProps) {
  const ref = useRef<HTMLDivElement>();
  const settings = useSharedSettings();
  const stage = props.stage;
  return (
    <div
      className={clsx(styles.darkModeToggle,)}
      ref={ref}
    >TEST</div>
  );
}
