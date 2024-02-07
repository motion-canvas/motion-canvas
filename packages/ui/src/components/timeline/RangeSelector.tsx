import styles from './Timeline.module.scss';

import clsx from 'clsx';
import {RefObject} from 'preact';
import {useCallback, useEffect, useState} from 'preact/hooks';
import {useApplication, useTimelineContext} from '../../contexts';
import {
  useDuration,
  useKeyHold,
  usePreviewSettings,
  useSharedSettings,
} from '../../hooks';
import {labelClipDraggingLeftSignal} from '../../signals';
import {MouseButton} from '../../utils';
import {DragIndicator} from '../icons';

export interface RangeSelectorProps {
  rangeRef: RefObject<HTMLDivElement>;
}

export function RangeSelector({rangeRef}: RangeSelectorProps) {
  const {pixelsToFrames, framesToPercents, pointerToFrames} =
    useTimelineContext();
  const {player, meta} = useApplication();
  const {range} = useSharedSettings();
  const {fps} = usePreviewSettings();
  const duration = useDuration();
  const startFrame = player.status.secondsToFrames(range[0]);
  const endFrame = Math.min(player.status.secondsToFrames(range[1]), duration);
  const [start, setStart] = useState(startFrame);
  const [end, setEnd] = useState(endFrame);
  const shiftHeld = useKeyHold('Shift');
  const controlHeld = useKeyHold('Control');

  const onDrop = useCallback(() => {
    labelClipDraggingLeftSignal.value = null;
    meta.shared.range.update(start, end, duration, fps);
  }, [start, end, duration, fps]);

  useEffect(() => {
    setStart(startFrame);
    setEnd(endFrame);
  }, [startFrame, endFrame, range[0], range[1]]);

  let normalizedStart = start;
  let normalizedEnd = end;
  if (start > end) {
    normalizedStart = end;
    normalizedEnd = start;
  }

  return (
    <div
      className={clsx(
        styles.rangeTrack,
        shiftHeld && controlHeld && styles.active,
      )}
      onPointerDown={event => {
        if (event.button === MouseButton.Left) {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);

          setStart(pointerToFrames(event.clientX));
          setEnd(pointerToFrames(event.clientX));
        }
      }}
      onPointerMove={event => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          setEnd(end + pixelsToFrames(event.movementX));
        }
      }}
      onPointerUp={event => {
        if (event.button === MouseButton.Left) {
          event.currentTarget.releasePointerCapture(event.pointerId);
          onDrop();
        }
      }}
    >
      <div
        ref={rangeRef}
        style={{
          flexDirection: start > end ? 'row-reverse' : 'row',
          left: `${framesToPercents(Math.ceil(Math.max(0, normalizedStart)))}%`,
          right: `${
            100 - framesToPercents(Math.ceil(Math.min(duration, normalizedEnd)))
          }%`,
        }}
        className={clsx(
          styles.range,
          shiftHeld && !controlHeld && styles.active,
        )}
        onPointerDown={event => {
          if (event.button === MouseButton.Left) {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerMove={event => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            setStart(start + pixelsToFrames(event.movementX));
            setEnd(end + pixelsToFrames(event.movementX));
          }
        }}
        onPointerUp={event => {
          if (event.button === MouseButton.Left) {
            event.currentTarget.releasePointerCapture(event.pointerId);
            onDrop();
          }
        }}
        onDblClick={() => {
          meta.shared.range.update(0, Infinity, duration, fps);
        }}
      >
        <RangeHandle value={start} setValue={setStart} onDrop={onDrop} />
        <div class={styles.handleSpacer} />
        <RangeHandle value={end} setValue={setEnd} onDrop={onDrop} />
      </div>
    </div>
  );
}

interface RangeHandleProps {
  value: number;
  setValue: (value: number) => void;
  onDrop: (event: PointerEvent) => void;
}

function RangeHandle({value, setValue, onDrop}: RangeHandleProps) {
  const {pixelsToFrames} = useTimelineContext();
  const {player} = useApplication();

  return (
    <DragIndicator
      className={styles.handle}
      onPointerDown={event => {
        if (event.button === MouseButton.Left) {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          labelClipDraggingLeftSignal.value =
            player.status.framesToSeconds(value);
        }
      }}
      onPointerMove={event => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.stopPropagation();
          const newValue = value + pixelsToFrames(event.movementX);
          setValue(newValue);
          labelClipDraggingLeftSignal.value =
            player.status.framesToSeconds(newValue);
        }
      }}
      onPointerUp={event => {
        if (event.button === MouseButton.Left) {
          event.stopPropagation();
          event.currentTarget.releasePointerCapture(event.pointerId);
          onDrop(event);
        }
      }}
    />
  );
}
