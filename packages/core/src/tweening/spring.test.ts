/* eslint-disable @typescript-eslint/no-unused-vars */

import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {PlaybackManager, PlaybackStatus} from '../app';
import {threads} from '../threading';
import {endPlayback, startPlayback, useTime} from '../utils';
import {spring} from './spring';

describe('spring()', () => {
  const playback = new PlaybackManager();
  const status = new PlaybackStatus(playback);
  beforeAll(() => startPlayback(status));
  afterAll(() => endPlayback(status));

  test('Framerate-independent spring duration', () => {
    let timeA;
    // should be around 1.13333333 seconds
    const taskA = threads(function* () {
      yield* spring(
        {
          mass: 0.1,
          stiffness: 20,
          damping: 1.5,
        },
        0,
        300,
        _ => {
          // do nothing
        },
      );
      timeA = useTime();
    });

    let timeB;
    const taskB = threads(function* () {
      yield* spring(
        {
          mass: 0.1,
          stiffness: 20,
          damping: 1.5,
        },
        0,
        300,
        _ => {
          // do nothing
        },
      );
      timeB = useTime();
    });

    let timeC;
    const taskC = threads(function* () {
      yield* spring(
        {
          mass: 0.1,
          stiffness: 20,
          damping: 1.5,
        },
        0,
        300,
        _ => {
          // do nothing
        },
      );
      timeC = useTime();
    });

    playback.fps = 60;
    playback.frame = 0;
    for (const _ of taskA) {
      playback.frame++;
    }

    playback.fps = 24;
    playback.frame = 0;
    for (const _ of taskB) {
      playback.frame++;
    }

    playback.fps = 120;
    playback.frame = 0;
    for (const _ of taskC) {
      playback.frame++;
    }

    expect(timeA).toBeCloseTo(1.5, 0);
    expect(timeB).toBeCloseTo(1.5, 0);
    expect(timeC).toBeCloseTo(1.5, 0);
  });

  test('Accumulated time offset', () => {
    let time;
    const task = threads(function* () {
      yield* spring(
        {
          mass: 0.1,
          stiffness: 20,
          damping: 1.5,
        },
        0,
        300,
        _ => {
          // do nothing
        },
      );
      time = useTime();
    });

    playback.fps = 10;
    playback.frame = 0;
    for (const _ of task) {
      playback.frame++;
    }

    expect(playback.frame).toBe(18);
    expect(time).toBeCloseTo(1.5, 0);
  });
});
