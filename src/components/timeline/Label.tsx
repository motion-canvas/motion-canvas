import styles from './Timeline.module.scss';

import type {Scene, TimeEvent} from '@motion-canvas/core/Scene';
import {useDrag, usePlayer} from '../../hooks';
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'preact/hooks';
import {TimelineContext} from './TimelineContext';

interface LabelProps {
  event: TimeEvent;
  scene: Scene;
}

export function Label({event, scene}: LabelProps) {
  const {fullLength, duration} = useContext(TimelineContext);
  const player = usePlayer();
  const durationSeconds = player.project.framesToSeconds(duration);
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
        const newFrame = Math.max(0, eventTime);
        if (event.offset !== newFrame) {
          scene.setFrameEvent(event.name, newFrame, !e.shiftKey);
          player.reload();
        }
      },
      [event, eventTime],
    ),
  );

  useLayoutEffect(() => {
    setEventTime(event.offset);
  }, [event.offset]);

  return (
    <>
      <div
        onMouseDown={e => {
          if (e.button === 1) {
            e.preventDefault();
            player.requestSeek(
              scene.firstFrame +
                player.project.secondsToFrames(
                  event.initialTime + event.offset,
                ),
            );
          } else {
            handleDrag(e);
          }
        }}
        className={styles.labelClip}
        data-name={event.name}
        style={{
          left: `${
            (scene.firstFrame +
              scene.project.secondsToFrames(
                event.initialTime + Math.max(0, eventTime),
              ) /
                duration) *
            100
          }%`,
        }}
      />
      <div
        className={styles.labelClipTarget}
        style={{
          left: `${
            ((scene.firstFrame +
              scene.project.secondsToFrames(event.targetTime)) /
              duration) *
            100
          }%`,
        }}
      />
      <div
        className={styles.labelClipStart}
        style={{
          left: `${
            ((scene.firstFrame +
              scene.project.secondsToFrames(event.initialTime)) /
              duration) *
            100
          }%`,
          width: `${
            (Math.max(0, scene.project.secondsToFrames(eventTime)) / duration) *
            100
          }%`,
        }}
      />
    </>
  );
}
