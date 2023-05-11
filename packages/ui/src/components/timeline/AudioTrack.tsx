import styles from './Timeline.module.scss';

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import {
  useDrag,
  useKeyHold,
  useSharedSettings,
  useSubscribableValue,
} from '../../hooks';
import {useApplication, useTimelineContext} from '../../contexts';
import clsx from 'clsx';

const HEIGHT = 48;

export function AudioTrack() {
  const ref = useRef<HTMLCanvasElement>();
  const {player, meta} = useApplication();
  const {audioOffset} = useSharedSettings();
  const [hover, setHover] = useState(false);
  const shiftHeld = useKeyHold('Shift');
  const [editingOffset, setEditingOffset] = useState(0);
  const context = useMemo(() => ref.current?.getContext('2d'), [ref.current]);
  const {
    viewLength,
    firstVisibleFrame,
    lastVisibleFrame,
    density,
    framesToPercents,
    pixelsToFrames,
  } = useTimelineContext();

  const audioData = useSubscribableValue(player.audio.onDataChanged);
  const fullOffset = audioOffset + editingOffset;

  const [handleDrag, isDragging] = useDrag(
    useCallback(
      dx => {
        setEditingOffset(
          editingOffset + player.status.framesToSeconds(pixelsToFrames(dx)),
        );
      },
      [editingOffset, pixelsToFrames],
    ),
    useCallback(() => {
      meta.shared.audioOffset.set(fullOffset);
    }, [fullOffset]),
  );

  const isActive = (hover && shiftHeld) || isDragging;

  useLayoutEffect(() => {
    if (!context) return;
    context.clearRect(0, 0, viewLength, HEIGHT * 2);
    if (!audioData) return;

    context.beginPath();
    context.moveTo(0, HEIGHT);

    const start =
      (player.status.framesToSeconds(firstVisibleFrame) - fullOffset) *
      audioData.sampleRate;
    const end =
      (player.status.framesToSeconds(lastVisibleFrame) - fullOffset) *
      audioData.sampleRate;

    const flooredStart = Math.floor(start);
    const padding = flooredStart - start;
    const length = end - start;
    const step = Math.ceil(density);
    for (let index = start; index < end; index += step * 2) {
      const offset = index - start;
      const sample = Math.round(flooredStart + offset);
      if (sample >= audioData.peaks.length) break;

      context.lineTo(
        ((padding + offset) / length) * viewLength,
        (audioData.peaks[sample] / audioData.absoluteMax) * HEIGHT + HEIGHT,
      );
      context.lineTo(
        ((padding + offset + step) / length) * viewLength,
        (audioData.peaks[sample + 1] / audioData.absoluteMax) * HEIGHT + HEIGHT,
      );
    }

    context.lineWidth = 1;
    context.lineJoin = 'round';
    context.strokeStyle = '#444';
    context.stroke();
  }, [
    fullOffset,
    context,
    audioData,
    density,
    viewLength,
    firstVisibleFrame,
    lastVisibleFrame,
  ]);

  useLayoutEffect(() => {
    setEditingOffset(0);
  }, [audioOffset]);

  const style = useMemo(
    () => ({
      marginLeft: `${framesToPercents(firstVisibleFrame)}%`,
      width: `${framesToPercents(lastVisibleFrame - firstVisibleFrame)}%`,
      height: `${HEIGHT * 2}px`,
    }),
    [firstVisibleFrame, lastVisibleFrame, framesToPercents],
  );

  return (
    <canvas
      ref={ref}
      className={clsx(
        styles.audioTrack,
        isActive && styles.active,
        audioData && styles.show,
      )}
      style={style}
      width={viewLength}
      height={HEIGHT * 2}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={event => {
        if (event.shiftKey) {
          handleDrag(event);
        }
      }}
    />
  );
}
