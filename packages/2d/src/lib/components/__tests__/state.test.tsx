import {createSignal, join, waitFor} from '@motion-canvas/core';
import {describe, expect, it} from 'vitest';
import {Circle} from '../Circle';
import {generatorTest} from './generatorTest';
import {mockScene2D} from './mockScene2D';

describe('state', () => {
  mockScene2D();

  it('Restoring state', () => {
    const signal = createSignal(45);
    const circle = (
      <Circle lineWidth={8} startAngle={signal} end={0.5} />
    ) as Circle;
    circle.save();

    circle.lineWidth(16);
    circle.startAngle(90);
    circle.end(0.25);

    circle.restore();

    expect(circle.lineWidth()).toBe(8);
    expect(circle.startAngle()).toBe(45);
    expect(circle.end()).toBe(0.5);

    signal(180);

    expect(circle.startAngle()).toBe(45);
    expect(circle.startArrow.context.isInitial()).toBe(true);
  });

  it(
    'Tweening state',
    generatorTest(function* () {
      const signal = createSignal(20);
      const circle = (
        <Circle lineWidth={8} startAngle={signal} end={0.5} />
      ) as Circle;
      circle.save();

      circle.lineWidth(16);
      circle.startAngle(40);
      circle.end(0.3);

      const task = yield circle.restore(2);
      yield* waitFor(1);

      expect(circle.lineWidth()).closeTo(12, 0.0001);
      expect(circle.startAngle()).closeTo(30, 0.0001);
      expect(circle.end()).closeTo(0.4, 0.0001);

      yield* join(task);

      expect(circle.lineWidth()).toBe(8);
      expect(circle.startAngle()).toBe(20);
      expect(circle.end()).toBe(0.5);
    }),
  );
});
