import styles from './Timeline.module.scss';

import type {Scene, TimeEvent} from '@motion-canvas/core/lib/scenes';
import {useDrag} from '../../hooks';
import {useCallback, useLayoutEffect, useState} from 'preact/hooks';
import {useApplication, useTimelineContext} from '../../contexts';
import {findAndOpenFirstUserFile} from '../../utils';

interface LabelProps {
  event: TimeEvent;
  scene: Scene;
}

export function Label({event, scene}: LabelProps) {
  const {framesToPercents, pixelsToFrames} = useTimelineContext();
  const {player} = useApplication();
  const [eventTime, setEventTime] = useState(event.offset);
  const [handleDrag] = useDrag(
    useCallback(
      dx => {
        setEventTime(
          eventTime + player.status.framesToSeconds(pixelsToFrames(dx)),
        );
      },
      [eventTime, player, pixelsToFrames],
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
        onDblClick={async () => {
          if (event.stack) {
            await findAndOpenFirstUserFile(event.stack);
          }
        }}
        onMouseDown={e => {
          if (e.button === 1) {
            e.preventDefault();
            player.requestSeek(
              scene.firstFrame +
                player.status.secondsToFrames(event.initialTime + event.offset),
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
              scene.playback.secondsToFrames(
                event.initialTime + Math.max(0, eventTime),
              ),
          )}%`,
        }}
      />
      <div
        className={styles.labelClipTarget}
        style={{
          left: `${framesToPercents(
            scene.firstFrame + scene.playback.secondsToFrames(event.targetTime),
          )}%`,
        }}
      />
      <div
        className={styles.labelClipStart}
        style={{
          left: `${framesToPercents(
            scene.firstFrame +
              scene.playback.secondsToFrames(event.initialTime),
          )}%`,
          width: `${Math.max(
            0,
            framesToPercents(scene.playback.secondsToFrames(eventTime)),
          )}%`,
        }}
      />
    </>
  );
}
