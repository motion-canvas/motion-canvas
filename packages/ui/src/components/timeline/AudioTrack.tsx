import styles from './Timeline.module.scss';

import type {Scene} from '@motion-canvas/core';
import clsx from 'clsx';
import {useLayoutEffect, useMemo, useRef} from 'preact/hooks';
import {useApplication, useTimelineContext} from '../../contexts';
import {useScenes, useSharedSettings, useSubscribableValue} from '../../hooks';

const HEIGHT = 48;

export function AudioTrack() {
  const {player} = useApplication();
  const {audioOffset} = useSharedSettings();
  const scenes = useScenes();
  const source = player.audio.getSource();

  return (
    <div className={styles.audioTrack}>
      {source && <AudioClip audio={source} offset={audioOffset} disabled />}
      {scenes.map(scene => (
        <AudioGroup scene={scene} />
      ))}
    </div>
  );
}

interface AudioGroupProps {
  scene: Scene;
}

export function AudioGroup({scene}: AudioGroupProps) {
  const sounds = useSubscribableValue(scene.sounds.onChanged);
  return (
    <>
      {sounds.map(sound => (
        <AudioClip {...sound} />
      ))}
    </>
  );
}

interface AudioClipProps {
  audio: string;
  offset: number;
  start?: number;
  end?: number;
  realPlaybackRate?: number;
  disabled?: boolean;
}

export function AudioClip({
  audio,
  offset,
  start = 0,
  end = Infinity,
  realPlaybackRate = 1,
  disabled,
}: AudioClipProps) {
  const {player} = useApplication();
  const audioData = useSubscribableValue(
    player.audioResources.get(audio).onData,
  );

  const ref = useRef<HTMLCanvasElement>();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const {
    viewLength,
    firstVisibleTime,
    lastVisibleTime,
    density,
    secondsToPercents,
    secondsToPixels,
  } = useTimelineContext();

  const {
    waveformWidth,
    waveformStart,
    waveformEnd,
    clipStart,
    clipDuration,
    waveformVisible,
  } = useMemo(() => {
    const endOffset =
      (Math.min(audioData.duration, end) - start) / realPlaybackRate;

    const clipStart = offset;
    const clipEnd = offset + endOffset;

    const waveformStart = Math.max(firstVisibleTime, clipStart);
    const waveformEnd = Math.min(lastVisibleTime, clipEnd);

    const duration = waveformEnd - waveformStart;
    const waveformVisible =
      waveformStart < waveformEnd &&
      waveformEnd > firstVisibleTime &&
      waveformStart < lastVisibleTime;

    return {
      waveformWidth: secondsToPixels(duration),
      waveformStart,
      waveformEnd,
      clipStart,
      clipDuration: clipEnd - clipStart,
      waveformVisible,
    };
  }, [
    audioData,
    end,
    start,
    firstVisibleTime,
    lastVisibleTime,
    secondsToPixels,
    realPlaybackRate,
    offset,
  ]);

  useLayoutEffect(() => {
    if (!waveformVisible || !ref.current) return;
    if (!contextRef.current || contextRef.current?.canvas !== ref.current) {
      contextRef.current = ref.current?.getContext('2d');
    }

    const context = contextRef.current;
    if (!context) return;
    context.clearRect(0, 0, viewLength, HEIGHT * 2);
    context.beginPath();
    context.moveTo(0, HEIGHT);

    const relativeStartTime =
      (waveformStart - offset) * realPlaybackRate + start;
    const relativeEndTime = (waveformEnd - offset) * realPlaybackRate + start;

    const startSample = relativeStartTime * audioData.sampleRate;
    const endSample = relativeEndTime * audioData.sampleRate;

    const step = Math.ceil(density * 4);
    const flooredStart = Math.floor(startSample / step / 2) * step * 2;
    const padding = flooredStart - startSample;
    const length = endSample - startSample;

    for (let index = startSample; index <= endSample; index += step * 2) {
      const offset = index - startSample;
      const sample = Math.floor(flooredStart + offset);
      if (sample >= audioData.peaks.length) break;

      context.lineTo(
        ((padding + offset) / length) * waveformWidth,
        (audioData.peaks[sample] / audioData.absoluteMax) * HEIGHT + HEIGHT,
      );
      context.lineTo(
        ((padding + offset + step) / length) * waveformWidth,
        (audioData.peaks[sample + 1] / audioData.absoluteMax) * HEIGHT + HEIGHT,
      );
    }

    context.lineWidth = 1;
    context.lineJoin = 'round';
    context.strokeStyle = '#fff';
    context.stroke();
  }, [
    waveformStart,
    waveformEnd,
    waveformWidth,
    waveformVisible,
    offset,
    density,
    viewLength,
    start,
    audioData,
    realPlaybackRate,
  ]);

  const [wrapperStyle, canvasStyle] = useMemo(
    () => [
      {
        left: `${secondsToPercents(clipStart)}%`,
        width: `${secondsToPercents(clipDuration)}%`,
        height: `${HEIGHT * 2}px`,
      },
      {
        left: `${((waveformStart - clipStart) / clipDuration) * 100}%`,
      },
    ],
    [waveformStart, clipDuration, clipStart, secondsToPercents],
  );

  return (
    <div
      className={clsx(styles.audioClip, !disabled && styles.hoverable)}
      style={wrapperStyle}
    >
      {!disabled && waveformWidth > 8 && (
        <div className={styles.audioLabel}>{audio}</div>
      )}
      {waveformVisible && waveformWidth > 8 && (
        <canvas
          ref={ref}
          style={canvasStyle}
          className={styles.audioCanvas}
          width={Math.round(waveformWidth)}
          height={HEIGHT * 2}
        />
      )}
    </div>
  );
}
