import styles from './Timeline.module.scss';

import type {Scene, TimeEvent} from '@motion-canvas/core/lib/scenes';
import {useDrag} from '../../hooks';
import {useCallback, useLayoutEffect, useState} from 'preact/hooks';
import {usePlayer, useProject, useTimelineContext} from '../../contexts';

interface LabelProps {
  event: TimeEvent;
  scene: Scene;
}

export function Label({event, scene}: LabelProps) {
  const {framesToPercents, pixelsToFrames} = useTimelineContext();
  const player = usePlayer();
  const project = useProject();
  const [eventTime, setEventTime] = useState(event.offset);
  const [handleDrag] = useDrag(
    useCallback(
      dx => {
        setEventTime(eventTime + project.framesToSeconds(pixelsToFrames(dx)));
      },
      [eventTime, project, pixelsToFrames],
    ),
    useCallback(
      e => {
        const newFrame = Math.max(0, eventTime);
        if (event.offset !== newFrame) {
          scene.timeEvents.set(event.name, newFrame, e.shiftKey);
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
          left: `${framesToPercents(
            scene.firstFrame +
              scene.project.secondsToFrames(
                event.initialTime + Math.max(0, eventTime),
              ),
          )}%`,
        }}
      />
      <div
        className={styles.labelClipTarget}
        style={{
          left: `${framesToPercents(
            scene.firstFrame + scene.project.secondsToFrames(event.targetTime),
          )}%`,
        }}
      />
      <div
        className={styles.labelClipStart}
        style={{
          left: `${framesToPercents(
            scene.firstFrame + scene.project.secondsToFrames(event.initialTime),
          )}%`,
          width: `${Math.max(
            0,
            framesToPercents(scene.project.secondsToFrames(eventTime)),
          )}%`,
        }}
      />
    </>
  );
}
