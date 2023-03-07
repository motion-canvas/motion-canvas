import {Scene} from '@motion-canvas/core/lib/scenes';
import {useSubscribableValue} from '../../hooks';
import styles from './Timeline.module.scss';
import clsx from 'clsx';

export interface SlideTrackProps {
  scene: Scene;
  duration: number;
}

export function SlideTrack({scene, duration}: SlideTrackProps) {
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
            <div className={styles.name}>{slide.name}</div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
}
