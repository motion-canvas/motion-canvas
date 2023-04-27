/* eslint-disable @typescript-eslint/no-unused-vars */

import {describe, test, expect, beforeAll, afterAll} from 'vitest';
import {endPlayback, startPlayback, useTime} from '../utils';
import {waitFor} from '../flow';
import {threads} from './threads';
import {join} from './join';
import {PlaybackManager, PlaybackStatus} from '../app';

describe('join()', () => {
  const playback = new PlaybackManager();
  const status = new PlaybackStatus(playback);
  beforeAll(() => startPlayback(status));
  afterAll(() => endPlayback(status));

  test('Elapsed time when joining all threads', () => {
    let time = NaN;
    const task = threads(function* () {
      const taskA = yield waitFor(0.15);
      const taskB = yield waitFor(0.17);
      yield* join(taskA, taskB);
      time = useTime();
    });

    playback.fps = 10;
    playback.frame = 0;
    for (const _ of task) {
      playback.frame++;
    }

    expect(time).toBeCloseTo(0.17);
  });

  test('Elapsed time when joining any thread', () => {
    let time = NaN;
    const task = threads(function* () {
      const taskA = yield waitFor(0.15);
      const taskB = yield waitFor(0.17);
      yield* join(false, taskA, taskB);
      time = useTime();
    });

    playback.fps = 10;
    playback.frame = 0;
    for (const _ of task) {
      playback.frame++;
    }

    expect(time).toBeCloseTo(0.15);
  });

  test('Elapsed time when joining an already canceled thread', () => {
    let time = NaN;
    const task = threads(function* () {
      const waitTask = yield waitFor(0.15);
      yield* waitFor(0.2);
      yield* join(waitTask);
      time = useTime();
    });

    playback.fps = 10;
    playback.frame = 0;
    for (const _ of task) {
      playback.frame++;
    }

    expect(time).toBeCloseTo(0.2);
  });

  test('Elapsed time when joining a thread right after cancellation', () => {
    let time = NaN;
    const task = threads(function* () {
      const waitTask = yield waitFor(0.05);
      yield* join(waitTask);
      time = useTime();
    });

    playback.fps = 10;
    playback.frame = 0;
    for (const _ of task) {
      playback.frame++;
    }

    expect(time).toBeCloseTo(0.05);
  });
});
