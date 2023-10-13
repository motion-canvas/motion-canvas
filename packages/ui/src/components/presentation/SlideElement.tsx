import type {Slide} from '@motion-canvas/core/lib/scenes';
import {useApplication} from '../../contexts';
import clsx from 'clsx';
import styles from './SlideGraph.module.scss';

interface SlideElementProps {
  slide: Slide;
  active: boolean;
  inProgress: boolean;
}

export function SlideElement({slide, active, inProgress}: SlideElementProps) {
  const {presenter} = useApplication();
  return (
    <button
      className={clsx(
        styles.slide,
        active && styles.active,
        inProgress && styles.inProgress,
      )}
      onClick={() => presenter.requestSlide(slide.id)}
    >
      {slide.name}
    </button>
  );
}
 