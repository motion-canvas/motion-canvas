import {describe, test, beforeEach, expect} from 'vitest';
import {threads} from './threads';
import {noop, run} from '../flow';
import {setProject} from '../utils';
import {Project} from '../Project';

describe('threads()', () => {
  beforeEach(() => {
    setProject(new Project({name: 'tests', scenes: []}));
  });

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
});
