import { useRef } from 'preact/hooks';

import viewportStyles from './Viewport.module.scss';
import clsx from 'clsx';
import {useEffect, useState} from 'react';
import { JSXInternal } from 'preact/src/jsx';
import {usePlayerTime, useSubscribableValue} from '../../hooks';
import {useInspection, useApplication} from '../../contexts';


export interface CustomStageOverlayProps {
  showOverlay?: boolean,
  content?: JSXInternal.Element
}
interface ProgressProps {
  completion: number;
}

function ProgressBar({completion}: ProgressProps) {
  return <div className={clsx(viewportStyles.overlayProgress)}>
  <div className={viewportStyles.progress}>
    <div
      className={viewportStyles.progressFill}
      style={{width: `${completion * 100}%`}}
    />
  </div>
      </div>
}

function PlaybackProgress() {
  const {presenter} = useApplication();
  const presenterInfo = useSubscribableValue(presenter.onInfoChanged)
  return <ProgressBar completion={presenterInfo.sceneFramesRendered/presenterInfo.videoDuration} />
}


function PresentationProgress() {
  const {presenter} = useApplication();
  const presenterInfo = useSubscribableValue(presenter.onInfoChanged)
  return <ProgressBar completion={presenterInfo.index/presenterInfo.count} />
}

export function CustomStageOverlay(props?: CustomStageOverlayProps, callbacks?: any) {
  const ref = useRef<HTMLDivElement>();
  const {showOverlay, content} = props;
  const {presenter} = useApplication();
  const presenterInfo = useSubscribableValue(presenter.onInfoChanged)
  
  useEffect(() => {
    callbacks?.test();
  }, [showOverlay])
  return (
    <div 
      // style={{opacity: `${showOverlay ? 1 : 'none'}`}}
      className={clsx(viewportStyles.customStageOverlay, presenterInfo.isWaiting && viewportStyles.paused)}
      ref={ref}>
        <div
        className={clsx(viewportStyles.overlayContainer, !showOverlay && viewportStyles.hidden)}>
          {content}</div>
          {/* <PresentationProgress /> */}
          <PlaybackProgress />
        </div>
  );
}

export type {CustomStageOverlayProps as CustomStageOverlayPropsType}

