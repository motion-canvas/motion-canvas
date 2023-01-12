import {describe, expect, test} from 'vitest';
import {Rect, Vector2} from '../types';
import {createSignal} from '../signals';

describe('Rect', () => {
  test('Correctly parses values', () => {
    const fromUndefined = new Rect();
    const fromProperties = new Rect(10, 20, 200, 100);
    const fromArray = new Rect([10, 20, 200, 100]);
    const fromVectors = new Rect(new Vector2(10, 20), new Vector2(200, 100));
    const fromObject = new Rect({x: 10, y: 20, width: 200, height: 100});

    expect(fromUndefined).toMatchObject({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    expect(fromProperties).toMatchObject({
      x: 10,
      y: 20,
      width: 200,
      height: 100,
    });
    expect(fromArray).toMatchObject({
      x: 10,
      y: 20,
      width: 200,
      height: 100,
    });
    expect(fromVectors).toMatchObject({
      x: 10,
      y: 20,
      width: 200,
      height: 100,
    });
    expect(fromObject).toMatchObject({
      x: 10,
      y: 20,
      width: 200,
      height: 100,
    });
  });

  test('Interpolates between rectangles', () => {
    const a = new Rect(10, 20, 200, 100);
    const b = new Rect(20, 40, 400, 200);

    const result = Rect.lerp(a, b, 0.5);

    expect(result).toMatchObject({
      x: 15,
      y: 30,
      width: 300,
      height: 150,
    });
  });

  test('Creates a compound signal', () => {
    const width = createSignal(200);
    const rect = Rect.createSignal(() => [10, 20, width(), 100]);

    expect(rect()).toMatchObject({x: 10, y: 20, width: 200, height: 100});
    expect(rect.x()).toBe(10);
    expect(rect.y()).toBe(20);
    expect(rect.width()).toBe(200);
    expect(rect.height()).toBe(100);

    width(400);
    expect(rect()).toMatchObject({x: 10, y: 20, width: 400, height: 100});
    expect(rect.width()).toBe(400);
  });
});
