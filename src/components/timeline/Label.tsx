import styles from './Timeline.module.scss';

import type {Scene, TimeEvent} from '@motion-canvas/core/Scene';
import {useDrag, usePlayer} from '../../hooks';
import {useCallback, useContext, useEffect, useState} from 'preact/hooks';
import {TimelineContext} from './TimelineContext';

interface LabelProps {
  event: TimeEvent;
  scene: Scene;
}

export function Label({event, scene}: LabelProps) {
  const {fullLength, duration} = useContext(TimelineContext);
  const player = usePlayer();
  const [frame, setFrame] = useState(event.offset);
  const [handleDrag, isDragging] = useDrag(
    useCallback(
      dx => {
        setFrame(frame + (dx / fullLength) * duration);
      },
      [frame, fullLength, duration],
    ),
  );

  useEffect(() => {
    setFrame(event.offset);
  }, [event]);

  useEffect(() => {
    if (isDragging) return;
    const newFrame = Math.max(0, Math.floor(frame));
    setFrame(newFrame);
    if (event.offset !== newFrame) {
      scene.setFrameEvent(event.name, newFrame);
      player.reload();
    }
  }, [isDragging, frame, event]);

  return (
    <>
      <div
        onMouseDown={handleDrag}
        className={styles.labelClip}
        data-name={event.name}
        style={{
          left: `${
            ((scene.firstFrame + event.initialFrame + Math.max(0, frame)) /
              duration) *
            100
          }%`,
        }}
      />
      <div
        className={styles.labelClipStart}
        style={{
          left: `${
            ((scene.firstFrame + event.initialFrame) / duration) * 100
          }%`,
          width: `${(Math.max(0, frame) / duration) * 100}%`,
        }}
      />
    </>
  );
}
