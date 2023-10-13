import styles from './PresentationControls.module.scss';

import {IconButton} from '../controls';
import {useDocumentEvent, useSubscribableValue} from '../../hooks';
import {MutableRef, useCallback, Ref} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {
  Close,
  Fullscreen,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '../icons';
import { PresentationKeyBindings } from './PresentationKeyBindings';
 
export interface PresentationControlsProps {
  customStage?: Ref<HTMLDivElement>
}

export function PresentationControls({customStage} : PresentationControlsProps) {
  const {presenter, renderer} = useApplication();
  const status = useSubscribableValue(presenter.onInfoChanged);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      customStage.current.requestFullscreen();
      // presenter.stage.finalBuffer.requestFullscreen();
      
    }
  };

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
