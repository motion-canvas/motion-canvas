import {describe, expect, test} from 'vitest';
import {Vector2} from '../types';
import {createSignal} from '../signals';

describe('Vector2', () => {
  test('Correctly parses values', () => {
    const fromUndefined = new Vector2();
    const fromScalar = new Vector2(3);
    const fromProperties = new Vector2(2, 4);
    const fromArray = new Vector2([2, -1]);
    const fromVector = new Vector2(Vector2.up);
    const fromObject = new Vector2({x: -1, y: 3});

    expect(fromUndefined).toMatchObject({x: 0, y: 0});
    expect(fromScalar).toMatchObject({x: 3, y: 3});
    expect(fromProperties).toMatchObject({x: 2, y: 4});
    expect(fromArray).toMatchObject({x: 2, y: -1});
    expect(fromVector).toMatchObject({x: 0, y: 1});
    expect(fromObject).toMatchObject({x: -1, y: 3});
  });

  test('Interpolates between vectors', () => {
    const a = new Vector2(10, 24);
    const b = new Vector2(-10, 12);

    const result = Vector2.lerp(a, b, 0.5);

    expect(result).toMatchObject({x: 0, y: 18});
  });

  test('Creates a compound signal', () => {
    const x = createSignal(1);
    const vector = Vector2.createSignal(() => [x(), 2]);

    expect(vector()).toMatchObject({x: 1, y: 2});
    expect(vector.x()).toBe(1);
    expect(vector.y()).toBe(2);

    x(3);
    expect(vector()).toMatchObject({x: 3, y: 2});
    expect(vector.x()).toBe(3);
  });
});
