/* eslint-disable @typescript-eslint/no-unused-vars */

import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {PlaybackManager, PlaybackStatus} from '../app';
import {threads} from '../threading';
import {endPlayback, startPlayback, useTime} from '../utils';
import {all} from './all';
import {waitFor} from './scheduling';

describe('waitFor()', () => {
  const playback = new PlaybackManager();
  const status = new PlaybackStatus(playback);
  beforeAll(() => startPlayback(status));
  afterAll(() => endPlayback(status));

  test('Framerate-independent wait duration', () => {
    let time60;
    const task60 = threads(function* () {
      yield* waitFor(3.1415);
      time60 = useTime();
    });

    let time24;
    const task24 = threads(function* () {
      yield* waitFor(3.1415);
      time24 = useTime();
    });

    playback.fps = 60;
    playback.frame = 0;
    for (const _ of task60) {
      playback.frame++;
    }

    playback.fps = 24;
    playback.frame = 0;
    for (const _ of task24) {
      playback.frame++;
    }

    expect(time60).toBeCloseTo(3.1415);
    expect(time24).toBeCloseTo(3.1415);
  });

  test('Accumulated time offset', () => {
    let time = NaN;
    const task = threads(function* () {
      yield* waitFor(0.15);
      yield* waitFor(0.15);
      yield* waitFor(0.15);
      time = useTime();
    });

    playback.fps = 10;
    playback.frame = 0;
    for (const _ of task) {
      playback.frame++;
    }

    expect(playback.frame).toBe(4);
    expect(time).toBeCloseTo(0.45);
  });

  test('Accumulated time offset from concurrent threads', () => {
    let time = NaN;
    const task = threads(function* () {
      yield* waitFor(0.15);
      yield* all(waitFor(0.3), waitFor(0.15));
      time = useTime();
    });

    playback.fps = 10;
    playback.frame = 0;
    for (const _ of task) {
      playback.frame++;
    }

    expect(playback.frame).toBe(4);
    expect(time).toBeCloseTo(0.45);
  });
});
