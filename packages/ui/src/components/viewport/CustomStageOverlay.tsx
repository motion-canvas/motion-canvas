import viewportStyles from './Viewport.module.scss';
import clsx from 'clsx';
import { JSXInternal } from 'preact/src/jsx';
import {usePlayerTime, usePresenterState, useSubscribableValue} from '../../hooks';
import {useInspection, useApplication} from '../../contexts';
import {usePlayerState} from '../../hooks';
import {IconButton, IconCheckbox, Input, Select} from '../controls';
import {ComponentChildren} from 'preact';
import { PresentationKeybindings } from '../presentation/PresentationKeybindings';
import {ViewportContext} from './ViewportContext';
import {JSX} from 'preact';
import { ModuleType } from '@motion-canvas/core';

import {
  useEffect,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import {
  Pause,
  PhotoCamera,
  PlayArrow,
  Repeat,
  SkipNext,
  SkipPrevious,
  FastForward,
  FastRewind,
  VolumeOff,
  VolumeOn,
} from '../icons';

export interface CustomStageOverlayProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: ComponentChildren;
  keyPressed?: any,
  isPlayer?: boolean
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

export function PlayerPauseOverlay(){
  const {paused} = usePlayerState();
  return(<IconButton className={clsx(viewportStyles.pauseIcon, paused && viewportStyles.hidden)}>
    <Pause />
  </IconButton>)
}

export function PresenterPauseOverlay(){
  const {presenter} = useApplication();
  const info = useSubscribableValue(presenter.onInfoChanged);
  return(<IconButton className={clsx(viewportStyles.pauseIcon, info.isWaiting && viewportStyles.hidden)}>
    <Pause />
  </IconButton>)
}

export function CustomStageOverlay(props?: CustomStageOverlayProps) {
  const ref = useRef<HTMLDivElement>();
  const {keyPressed, children, isPlayer = false} = props;
  const [showOverlay, setShowOverlay] = useState(false);
  const {presenter, player} = useApplication();
  const state = useContext(ViewportContext);
  let paused = false;
  if(isPlayer){
    paused = usePlayerState().paused;
  }
  else{
    paused = useSubscribableValue(presenter.onInfoChanged).isWaiting
  }

  // useAction(moduleShortcuts.SHOW_OVERLAY, () => setShowOverlay(prev => !prev));

  // useEffect(() => {
  //   if(PresentationKeybindings.SHOW_OVERLAY.includes(keyPressed)){
  //     setShowOverlay(prev => !prev)
  //   }
  // }, [keyPressed])

  return (
    <div 
    style={{aspectRatio: `${state.width / state.height}`}}
    {...props}
      className={clsx(viewportStyles.customStageOverlay, paused && viewportStyles.paused)}
      ref={ref}>
          <div
            className={clsx(viewportStyles.overlayContainer, !showOverlay && viewportStyles.hidden)}>
            {children}
          </div>
          {isPlayer ? <PlayerPauseOverlay /> : <PresenterPauseOverlay />}
          {/* { showProgress && <PresentationProgress /> } */}
          { !isPlayer && <PlaybackProgress /> }
        </div>
  );
}

export type {CustomStageOverlayProps as CustomStageOverlayPropsType}
export type CustomStageOverlayType = typeof CustomStageOverlay

