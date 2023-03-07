import styles from './PresentationControls.module.scss';

import {IconButton} from '../controls';
import {useDocumentEvent, useSubscribableValue} from '../../hooks';
import {useCallback} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {
  Close,
  Fullscreen,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '../icons';

export function PresentationControls() {
  const {presenter} = useApplication();
  const status = useSubscribableValue(presenter.onInfoChanged);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      presenter.stage.finalBuffer.requestFullscreen();
    }
  };

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        if (document.activeElement.tagName === 'INPUT') {
          return;
        }
        switch (event.key) {
          case ' ':
            event.preventDefault();
            presenter.resume();
            break;
          case 'ArrowLeft':
            event.preventDefault();
            if (event.shiftKey) {
              presenter.requestFirstSlide();
              return;
            }
            presenter.requestPreviousSlide();
            break;
          case 'ArrowRight':
            event.preventDefault();
            if (event.shiftKey) {
              presenter.requestLastSlide();
              return;
            }
            presenter.requestNextSlide();
            break;
          case 'f':
            event.preventDefault();
            toggleFullscreen();
            break;
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
