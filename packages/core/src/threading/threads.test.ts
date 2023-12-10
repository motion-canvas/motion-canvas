import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {PlaybackManager, PlaybackStatus} from '../app';
import {noop, run} from '../flow';
import {endPlayback, startPlayback, useThread} from '../utils';
import {threads} from './threads';

describe('threads()', () => {
  const status = new PlaybackStatus(new PlaybackManager());
  beforeAll(() => startPlayback(status));
  afterAll(() => endPlayback(status));

  test('Execution order', () => {
    const order: number[] = [];
    const task = threads(function* () {
      order.push(0);
      yield run(function* () {
        order.push(1);
        yield;
        order.push(4);
      });
      order.push(2);
      yield noop();
      order.push(3);
      yield;
      order.push(5);
    });

    [...task];

    expect(order).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test('Cancellation of child threads', () => {
    const task = threads(function* () {
      yield run(function* () {
        for (let i = 0; i < 10; i++) {
          yield;
        }
      });
      yield;
      yield;
    });

    expect([...task].length).toBe(2);
  });

  test('Pausing a thread', () => {
    const order: number[] = [];
    const task = threads(function* () {
      order.push(0);
      yield run(function* () {
        order.push(1);
        yield;
        order.push(5);
      });
      const child = useThread().children[0];
      child.pause(true);
      order.push(2);
      yield;
      order.push(3);
      yield;
      child.pause(false);
      order.push(4);
      yield;
      order.push(6);
    });

    [...task];

    expect(order).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});
