import styles from './PresentationControls.module.scss';

import {IconButton} from '../controls';
import {useDocumentEvent, useKeyDown, useSubscribableValue} from '../../hooks';
import {useCallback, Ref, StateUpdater} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {
  Close,
  Fullscreen,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '../icons';
import { useShortcuts } from '../../contexts/shortcuts';
import { useKeyBinding } from '../../hooks/useKeyBinding';
import {PresentationKeybindings} from './PresentationKeybindings';
import { Module } from '../../global';
import { useAction } from '../../hooks/useAction';
 
export interface PresentationControlsProps {
  customStage?: Ref<HTMLDivElement>,
  onKeyPressed? : (key: string) => void;
}

export function PresentationControls({customStage, onKeyPressed} : PresentationControlsProps) {
  const {presenter} = useApplication();
  const {moduleShortcuts, currentModule} : {moduleShortcuts : typeof PresentationKeybindings, currentModule : Module} = useShortcuts();
  const state = useSubscribableValue(presenter.onStateChanged);
  const status = useSubscribableValue(presenter.onInfoChanged);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      customStage.current.requestFullscreen();
      // presenter.stage.finalBuffer.requestFullscreen();
      
    }
  };
  
  useAction(moduleShortcuts.RESUME, () => presenter.resume());
  useAction(moduleShortcuts.PREV_SLIDE, () => presenter.resume());
  useAction(moduleShortcuts., () => presenter.resume());
  // useKeyAction(PresentationActions.NEXT_SLIDE,
  //   [KeyBindings.SPACEBAR, KeyBindings.RIGHT_ARROW],
  //   () => presenter.resume())

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        if (document.activeElement.tagName === 'INPUT') {
          return;
        }
        if(PresentationKeyBindings.RESUME.includes(event.key)){
          event.preventDefault();
          presenter.resume();
        }
        else if(PresentationKeyBindings.PREV_SLIDE.includes(event.key)){
          if (event.shiftKey) {
            presenter.requestFirstSlide();
            return;
          }
          presenter.requestPreviousSlide();
          
        }
        else if(PresentationKeyBindings.NEXT_SLIDE.includes(event.key)){
          event.preventDefault();
          if (event.shiftKey) {
            presenter.requestLastSlide();
            return;
          }
          presenter.requestNextSlide();
          
        }
        else if(PresentationKeyBindings.TOGGLE_FULLSCREEN.includes(event.key)){
          event.preventDefault();
          toggleFullscreen();
        }
        else if(PresentationKeyBindings.TOGGLE_PRESENT_MODE.includes(event.key)){
          if(state != PresenterState.Aborting){
            presenter.abort();
          }
          else{
            presenter.present({
              ...meta.getFullRenderingSettings(),
              name: project.name,
              slide: null,
            });
          }
        }
        onKeyPressed(event.key);
      },
      [presenter],
    ),
  );

  return (
    <div className={styles.controls}>
      <div className={styles.count}>
        [
        {((status.index ?? 0) + 1)
          .toString()
          .padStart(status.count.toString().length, '0')}
        /{status.count}]
      </div>
      <IconButton title="Go back to editing" onClick={() => presenter.abort()}>
        <Close />
      </IconButton>
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
      <IconButton title="Enter fullscreen [F]" onClick={toggleFullscreen}>
        <Fullscreen />
      </IconButton>
    </div>
  );
}
