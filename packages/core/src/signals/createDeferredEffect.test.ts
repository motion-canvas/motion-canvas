import {afterAll, beforeAll, describe, expect, test, vi} from 'vitest';
import {PlaybackManager, PlaybackStatus} from '../app';
import {run} from '../flow';
import {threads} from '../threading';
import {endPlayback, startPlayback} from '../utils';
import {createDeferredEffect} from './createDeferredEffect';
import {createSignal} from './createSignal';

describe('createDeferredEffect()', () => {
  const status = new PlaybackStatus(new PlaybackManager());
  beforeAll(() => startPlayback(status));
  afterAll(() => endPlayback(status));

  test('Deferred till the end of the frame', () => {
    const task = threads(function* () {
      const a = createSignal(1);
      const b = createSignal(2);
      const callback = vi.fn(() => {
        a();
        b();
      });
      const unsub = createDeferredEffect(callback);

      expect(callback).toBeCalledTimes(0);
      yield;
      expect(callback).toBeCalledTimes(1);
      yield;
      expect(callback).toBeCalledTimes(1);
      a(2);
      a(3);
      b(3);
      expect(callback).toBeCalledTimes(1);
      yield;
      expect(callback).toBeCalledTimes(2);

      unsub();
      yield;
      expect(callback).toBeCalledTimes(2);
    });

    [...task];
  });

  test('Executed after all threads', () => {
    const order: number[] = [];
    const task = threads(function* () {
      const signal = createSignal(0);
      order.push(0);

      yield run(function* () {
        createDeferredEffect(() => {
          signal();
          order.push(-1);
        });

        order.push(1);
        yield;
        order.push(4);
        yield;
      });

      yield run(function* () {
        order.push(2);
        yield;
        order.push(5);
        yield;
      });

      order.push(3);
      yield;
      signal(1);
      order.push(6);
      yield;
    });

    [...task];

    expect(order).toEqual([0, 1, 2, 3, -1, 4, 5, 6, -1]);
  });
});
