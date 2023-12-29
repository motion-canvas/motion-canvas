import {Scene} from '@motion-canvas/core';
import clsx from 'clsx';
import {useApplication} from '../../contexts';
import {useSubscribableValue} from '../../hooks';
import {findAndOpenFirstUserFile} from '../../utils';
import styles from './Timeline.module.scss';

export interface SlideTrackProps {
  scene: Scene;
  duration: number;
}

export function SlideTrack({scene, duration}: SlideTrackProps) {
  const {player} = useApplication();
  const slides = useSubscribableValue(scene.slides.onChanged);

  return slides.length > 0 ? (
    <div className={styles.slideTrack}>
      {slides[0].time > 0 && (
        <div
          className={clsx(styles.clip, styles.continuation)}
          style={{left: 0, width: `${(slides[0].time / duration) * 100}%`}}
        />
      )}
      {slides.map((slide, index) => (
        <div
          className={styles.clip}
          style={{
            width: `${
              (((slides[index + 1]?.time ?? duration) - slide.time) /
                duration) *
              100
            }%`,
          }}
        >
          <div className={styles.container}>
            <div
              title="Go to source"
              className={styles.name}
              onMouseUp={async event => {
                event.stopPropagation();
                if (event.button === 1) {
                  player.requestSeek(
                    scene.firstFrame +
                      player.status.secondsToFrames(slide.time),
                  );
                } else if (event.button === 0) {
                  await findAndOpenFirstUserFile(slide.stack);
                }
              }}
            >
              {slide.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
}
