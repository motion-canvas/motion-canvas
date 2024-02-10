import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {PlaybackManager, PlaybackStatus} from '../app';
import {noop, run} from '../flow';
import {endPlayback, startPlayback, useThread} from '../utils';
import {spawn} from './spawn';
import {threads} from './threads';

describe('threads()', () => {
  const status = new PlaybackStatus(new PlaybackManager());
  beforeAll(() => startPlayback(status));
  afterAll(() => endPlayback(status));

  test('Execution order - yield', () => {
    const order: number[] = [];
    const task = threads(function* () {
      order.push(0);
      yield run(function* () {
        order.push(1);
        yield;
        order.push(5);
      });
      yield run(function* () {
        order.push(2);
        yield;
        order.push(6);
      });
      order.push(3);
      yield noop();
      order.push(4);
      yield;
      order.push(7);
    });

    [...task];

    expect(order).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  test('Execution order - spawn', () => {
    const order: number[] = [];
    const task = threads(function* () {
      order.push(0);
      spawn(function* () {
        order.push(3);
        yield;
        order.push(6);
      });
      spawn(function* () {
        order.push(4);
        yield;
        order.push(7);
      });
      order.push(1);
      yield noop();
      order.push(2);
      yield;
      order.push(5);
      yield;
      order.push(8);
    });

    [...task];

    expect(order).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('Cancellation of child threads', () => {
    const task = threads(function* () {
      yield run(function* () {
        for (let i = 0; i < 10; i++) {
          yield;
        }
      });
      spawn(function* () {
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
        order.push(3);
        yield;
        order.push(8);
      });
      const yieldChild = useThread().children[0];
      spawn(function* () {
        order.push(4);
        yield;
        order.push(9);
      });
      order.push(2);
      yield;

      const spawnChild = useThread().children[1];
      yieldChild.pause(true);
      spawnChild.pause(true);

      order.push(5);
      yield;
      order.push(6);
      yield;

      yieldChild.pause(false);
      spawnChild.pause(false);

      order.push(7);
      yield;
      order.push(10);
    });

    [...task];

    expect(order).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
