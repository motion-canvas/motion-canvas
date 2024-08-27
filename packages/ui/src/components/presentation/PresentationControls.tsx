import styles from './PresentationControls.module.scss';

import {useApplication} from '../../contexts';
import {
  GLOBAL_PRESENTER_SHORTCUTS,
  useShortcuts,
} from '../../contexts/shortcuts';
import {useSubscribableValue} from '../../hooks';
import {IconButton} from '../controls';
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

  useShortcuts(GLOBAL_PRESENTER_SHORTCUTS, {
    togglePlayback: () => presenter.resume(),
    firstSlide: () => presenter.requestFirstSlide(),
    lastSlide: () => presenter.requestLastSlide(),
    previousSlide: () => presenter.requestPreviousSlide(),
    nextSlide: () => presenter.requestNextSlide(),
    toggleFullscreen,
  });

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
