import {useDuration, usePlayerState, useRendererState} from '../../hooks';
import {PlaybackControls, PlaybackProgress} from '../playback';
import {CurrentTime} from '../playback/CurrentTime';
import {EditorPreview} from './EditorPreview';
import styles from './Viewport.module.scss';
import {useApplication} from '../../contexts';
import {CustomStage} from './CustomStage';
import {RendererState} from '@motion-canvas/core';
import {useShortcut} from '../../hooks/useShortcut';

export function Viewport() {
  const [hoverRef] = useShortcut<HTMLDivElement>('viewport');
  const {player, renderer} = useApplication();
  const duration = useDuration();
  const {speed} = usePlayerState();
  const state = useRendererState();

  return (
    <div ref={hoverRef} className={styles.root}>
      {state === RendererState.Working ? (
        <CustomStage stage={renderer.stage} />
      ) : (
        <EditorPreview />
      )}
      <PlaybackProgress />
      <div className={styles.playback}>
        <CurrentTime
          render={time => {
            return (
              <code className={styles.time} title="Current time">
                {formatDuration(player.status.framesToSeconds(time))}
                <span className={styles.frames}>
                  [{formatFrames(time, speed)}]
                </span>
              </code>
            );
          }}
        />
        <PlaybackControls />
        <code className={styles.duration} title="Duration">
          <span className={styles.frames}>
            [{formatFrames(duration, speed)}]
          </span>
          {formatDuration(player.status.framesToSeconds(duration))}
        </code>
      </div>
    </div>
  );
}

function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60) % 60;
  const seconds = Math.floor(duration % 60);

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function formatFrames(frames: number, speed: number) {
  const round = speed % 1 === 0;
  if (round) {
    return frames;
  } else {
    return frames.toFixed(2);
  }
}
