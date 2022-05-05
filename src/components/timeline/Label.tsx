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
  const durationSeconds = player.project.framesToSeconds(duration);
  const startSeconds = player.project.framesToSeconds(scene.firstFrame);
  const [eventTime, setEventTime] = useState(event.offset);
  const [handleDrag] = useDrag(
    useCallback(
      dx => {
        setEventTime(eventTime + (dx / fullLength) * durationSeconds);
      },
      [eventTime, fullLength, durationSeconds],
    ),
    useCallback(
      e => {
        const newFrame = Math.max(0, Math.floor(eventTime));
        setEventTime(newFrame);
        if (event.offset !== newFrame) {
          scene.setFrameEvent(event.name, newFrame, !e.shiftKey);
          player.reload();
        }
      },
      [event, eventTime],
    ),
  );

  useEffect(() => {
    setEventTime(event.offset);
  }, [event]);

  return (
    <>
      <div
        onMouseDown={handleDrag}
        className={styles.labelClip}
        data-name={event.name}
        style={{
          left: `${
            ((startSeconds + event.initialTime + Math.max(0, eventTime)) /
              durationSeconds) *
            100
          }%`,
        }}
      />
      <div
        className={styles.labelClipTarget}
        style={{
          left: `${
            ((startSeconds + event.targetTime) / durationSeconds) * 100
          }%`,
        }}
      />
      <div
        className={styles.labelClipStart}
        style={{
          left: `${
            ((startSeconds + event.initialTime) / durationSeconds) * 100
          }%`,
          width: `${(Math.max(0, eventTime) / durationSeconds) * 100}%`,
        }}
      />
    </>
  );
}
