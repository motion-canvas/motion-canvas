import {describe, expect, test} from 'vitest';
import {BBox, Vector2} from '../types';
import {createSignal} from '../signals';

describe('BBox', () => {
  test('Correctly parses values', () => {
    const fromUndefined = new BBox();
    const fromProperties = new BBox(10, 20, 200, 100);
    const fromArray = new BBox([10, 20, 200, 100]);
    const fromVectors = new BBox(new Vector2(10, 20), new Vector2(200, 100));
    const fromObject = new BBox({x: 10, y: 20, width: 200, height: 100});

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

  test('Interpolates between bounding boxes', () => {
    const a = new BBox(10, 20, 200, 100);
    const b = new BBox(20, 40, 400, 200);

    const result = BBox.lerp(a, b, 0.5);

    expect(result).toMatchObject({
      x: 15,
      y: 30,
      width: 300,
      height: 150,
    });
  });

  test('Creates a compound signal', () => {
    const width = createSignal(200);
    const box = BBox.createSignal(() => [10, 20, width(), 100]);

    expect(box()).toMatchObject({x: 10, y: 20, width: 200, height: 100});
    expect(box.x()).toBe(10);
    expect(box.y()).toBe(20);
    expect(box.width()).toBe(200);
    expect(box.height()).toBe(100);

    width(400);
    expect(box()).toMatchObject({x: 10, y: 20, width: 400, height: 100});
    expect(box.width()).toBe(400);
  });
});
