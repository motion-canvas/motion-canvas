/* eslint-disable @typescript-eslint/no-unused-vars */

import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {PlaybackManager, PlaybackStatus} from '../app';
import {threads} from '../threading';
import {endPlayback, startPlayback, useTime} from '../utils';
import {tween} from './tween';

describe('tween()', () => {
  const playback = new PlaybackManager();
  const status = new PlaybackStatus(playback);
  beforeAll(() => startPlayback(status));
  afterAll(() => endPlayback(status));

  test('Framerate-independent tween duration', () => {
    let time60 = NaN;
    const task60 = threads(function* () {
      yield* tween(3.1415, () => {
        // do nothing
      });
      time60 = useTime();
    });

    let time24 = NaN;
    const task24 = threads(function* () {
      yield* tween(3.1415, () => {
        // do nothing
      });
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
      yield* tween(0.45, () => {
        // do nothing
      });
      time = useTime();
    });

    playback.fps = 10;
    playback.frame = 0;
    for (const _ of task) {
      playback.frame++;
    }

    expect(playback.frame).toBe(5);
    expect(time).toBeCloseTo(0.45);
  });
});
