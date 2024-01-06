import styles from './Timeline.module.scss';

import type {Scene} from '@motion-canvas/core';
import type {TimeEvent} from '@motion-canvas/core/lib/scenes/timeEvents';
import {useLayoutEffect, useState} from 'preact/hooks';
import {useApplication, useTimelineContext} from '../../contexts';
import {labelClipDraggingLeftSignal} from '../../signals';
import {findAndOpenFirstUserFile} from '../../utils';

interface LabelProps {
  event: TimeEvent;
  scene: Scene;
}

export function Label({event, scene}: LabelProps) {
  const {framesToPercents, pixelsToFrames} = useTimelineContext();
  const {player} = useApplication();
  const [eventTime, setEventTime] = useState(event.offset);

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
        onPointerDown={e => {
          e.preventDefault();
          if (e.button === 0) {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            labelClipDraggingLeftSignal.value =
              event.initialTime + Math.max(0, eventTime);
          } else if (e.button === 1) {
            player.requestSeek(
              scene.firstFrame +
                player.status.secondsToFrames(event.initialTime + event.offset),
            );
          }
        }}
        onPointerMove={e => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.stopPropagation();
            const newTime =
              eventTime +
              player.status.framesToSeconds(pixelsToFrames(e.movementX));
            labelClipDraggingLeftSignal.value =
              event.initialTime + Math.max(0, newTime);
            setEventTime(newTime);
          }
        }}
        onPointerUp={e => {
          if (e.button === 0) {
            e.currentTarget.releasePointerCapture(e.pointerId);
            labelClipDraggingLeftSignal.value = null;
            const newFrame = Math.max(0, eventTime);
            setEventTime(newFrame);
            if (event.offset !== newFrame) {
              scene.timeEvents.set(event.name, newFrame, e.shiftKey);
            }
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
