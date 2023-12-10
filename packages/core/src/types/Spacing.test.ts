import {describe, expect, test} from 'vitest';
import {createSignal} from '../signals';
import {Spacing} from '../types';

describe('Spacing', () => {
  test('Correctly parses values', () => {
    const fromUndefined = new Spacing();
    const fromArray = new Spacing([1, 2, 3, 4]);
    const fromOne = new Spacing(1);
    const fromTwo = new Spacing(1, 2);
    const fromThree = new Spacing(1, 2, 3);
    const fromObject = new Spacing({
      top: 1,
      right: 2,
      bottom: 3,
      left: 4,
    });

    expect(fromUndefined).toMatchObject({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
    expect(fromArray).toMatchObject({
      top: 1,
      right: 2,
      bottom: 3,
      left: 4,
    });
    expect(fromOne).toMatchObject({
      top: 1,
      right: 1,
      bottom: 1,
      left: 1,
    });
    expect(fromTwo).toMatchObject({
      top: 1,
      right: 2,
      bottom: 1,
      left: 2,
    });
    expect(fromThree).toMatchObject({
      top: 1,
      right: 2,
      bottom: 3,
      left: 2,
    });
    expect(fromObject).toMatchObject({
      top: 1,
      right: 2,
      bottom: 3,
      left: 4,
    });
  });

  test('Interpolates between spacings', () => {
    const a = new Spacing(1, 2, 3, 4);
    const b = new Spacing(3, 4, 5, 6);

    const result = Spacing.lerp(a, b, 0.5);

    expect(result).toMatchObject({
      top: 2,
      right: 3,
      bottom: 4,
      left: 5,
    });
  });

  test('Creates a compound signal', () => {
    const horizontal = createSignal(2);
    const spacing = Spacing.createSignal(() => [1, horizontal(), 3]);

    expect(spacing()).toMatchObject({
      top: 1,
      right: 2,
      bottom: 3,
      left: 2,
    });
    expect(spacing.top()).toBe(1);
    expect(spacing.right()).toBe(2);
    expect(spacing.bottom()).toBe(3);
    expect(spacing.left()).toBe(2);

    horizontal(4);
    expect(spacing()).toMatchObject({
      top: 1,
      right: 4,
      bottom: 3,
      left: 4,
    });
    expect(spacing.left()).toBe(4);
    expect(spacing.right()).toBe(4);
  });
});
