import styles from './PresentationControls.module.scss';

import {IconButton} from '../controls';
import {useDocumentEvent, useKeyDown, useSubscribableValue} from '../../hooks';
import {useCallback, Ref, StateUpdater, useEffect} from 'preact/hooks';
import {useApplication, useShortcuts } from '../../contexts';
import {
  Close,
  Fullscreen,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '../icons';

import { PresentationKeybindings, PresentationKeybindingsType} from './PresentationKeybindings';
import { useAction } from '../../hooks/useAction';
import { PresenterState } from '@motion-canvas/core';
 
export interface PresentationControlsProps {
  customStage?: Ref<HTMLDivElement>,
  onKeyPressed? : (key: string) => void;
}

export function PresentationControls({customStage, onKeyPressed} : PresentationControlsProps) {
  const {presenter, project} = useApplication();
  // const {moduleShortcuts} : {moduleShortcuts: PresentationKeybindingsType} = useShortcuts();
  const state = useSubscribableValue(presenter.onStateChanged);
  const status = useSubscribableValue(presenter.onInfoChanged);

  useEffect(() => {
    presenter.setCustomStage(customStage.current);
  }, [])
  
  useAction(PresentationKeybindings.RESUME, () => presenter.resume());
  useAction(PresentationKeybindings.TOGGLE_FULLSCREEN, () => presenter.toggleFullscreen());
  useAction(PresentationKeybindings.PREV_SLIDE, (event) => event.shiftKey? presenter.requestFirstSlide() : presenter.requestPreviousSlide());
  useAction(PresentationKeybindings.NEXT_SLIDE, (event) => event.shiftKey? presenter.requestLastSlide() : presenter.requestNextSlide());
  useAction(PresentationKeybindings.TOGGLE_PRESENT_MODE, () => {
    console.log("P pressed on presentation mode!");
    if(state != PresenterState.Aborting){
      presenter.abort();
    }
  });

  // useAction(moduleShortcuts., () => presenter.resume());
  // useKeyAction(PresentationActions.NEXT_SLIDE,
  //   [KeyBindings.SPACEBAR, KeyBindings.RIGHT_ARROW],
  //   () => presenter.resume())

  // useDocumentEvent(
  //   'keydown',
  //   useCallback(
  //     event => {
  //       if (document.activeElement.tagName === 'INPUT') {
  //         return;
  //       }
  //       if(PresentationKeybindings.RESUME.includes(event.key)){
  //         event.preventDefault();
  //         presenter.resume();
  //       }
  //       else if(PresentationKeybindings.PREV_SLIDE.includes(event.key)){
  //         if (event.shiftKey) {
  //           presenter.requestFirstSlide();
  //           return;
  //         }
  //         presenter.requestPreviousSlide();
          
  //       }
  //       else if(PresentationKeybindings.NEXT_SLIDE.includes(event.key)){
  //         event.preventDefault();
  //         if (event.shiftKey) {
  //           presenter.requestLastSlide();
  //           return;
  //         }
  //         presenter.requestNextSlide();
          
  //       }
  //       else if(PresentationKeybindings.TOGGLE_FULLSCREEN.includes(event.key)){
  //         event.preventDefault();
  //         toggleFullscreen();
  //       }
  //       else if(PresentationKeybindings.TOGGLE_PRESENT_MODE.includes(event.key)){
  //         if(state != PresenterState.Aborting){
  //           presenter.abort();
  //         }
  //         else{
  //           presenter.present({
  //             ...meta.getFullRenderingSettings(),
  //             name: project.name,
  //             slide: null,
  //           });
  //         }
  //       }
  //       onKeyPressed(event.key);
  //     },
  //     [presenter],
  //   ),
  // );

  return (
    <div className={styles.controls}>
      <div className={styles.count}>
        [
        {((status.index ?? 0) + 1)
          .toString()
          .padStart(status.count.toString().length, '0')}
        /{status.count}]
      </div>
      {!project.variables?.fullscreen &&
        <IconButton title="Go back to editing" onClick={() => presenter.abort()}>
        <Close />
      </IconButton>
      }
      <IconButton
        title="Previous slide [Left arrow]"
        onClick={() => presenter.requestPreviousSlide()}
        disabled={!status.hasPrevious}
      >
        <SkipPrevious />
      </IconButton>
      <IconButton
        title="Resume [Space]"
        onClick={() => presenter.resume()}
        disabled={!status.isWaiting}
      >
        {status.isWaiting ? <PlayArrow /> : <Pause />}
      </IconButton>
      <IconButton
        title="Next slide [Right arrow]"
        onClick={() => presenter.requestNextSlide()}
        disabled={!status.hasNext}
      >
        <SkipNext />
      </IconButton>
      <IconButton title="Enter fullscreen [F]" onClick={presenter.toggleFullscreen}>
        <Fullscreen />
      </IconButton>
    </div>
  );
}
