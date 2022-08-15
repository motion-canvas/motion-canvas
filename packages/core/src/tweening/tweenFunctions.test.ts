import {deepTween, colorTween, vector2dTween} from './tweenFunctions';
import type {Vector2} from '../types';

describe('deepTween', () => {
  test('falls back to primitive tween for numbers', () => {
    expect(deepTween(5, 10, 3 / 5)).toEqual(8);
  });

  test('falls back to primitive tween for strings', () => {
    expect(deepTween('foo', 'foobar', 2 / 3)).toEqual('fooba');
  });

  test('interpolates between colors', () => {
    expect(deepTween('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)', 0)).toEqual(
      'hsl(0, 0%, 0%)',
    );
    expect(
      deepTween('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)', 1 / 2),
    ).toMatchInlineSnapshot(`"rgb(50% 50% 50%)"`);
    expect(deepTween('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)', 1)).toEqual(
      'hsl(0, 0%, 100%)',
    );
  });

  test('interpolates between values in an array', () => {
    expect(deepTween([0, 2], [1, 3], 1 / 2)).toEqual([0.5, 2.5]);
  });

  test('jumps to new array if values vary in length', () => {
    expect(deepTween([0, 2], [1, 3, 5], 0)).toEqual([0, 2]);
    expect(deepTween([0, 2], [1, 3, 5], 1 / 2)).toEqual([1, 3, 5]);
    expect(deepTween([0, 2], [1, 3, 5], 1)).toEqual([1, 3, 5]);
  });

  test('interpolates between values in a map', () => {
    expect(
      deepTween(new Map([['foo', 0]]), new Map([['foo', 5]]), 3 / 5),
    ).toEqual(new Map([['foo', 3]]));
  });

  test('deletes values in a map after a value of 0', () => {
    expect(deepTween(new Map([['foo', 5]]), new Map(), 3 / 5)).toEqual(
      new Map(),
    );
    expect(deepTween(new Map([['foo', 5]]), new Map(), 1)).toEqual(new Map());
  });

  test('retains missing values in a map at a value of 0', () => {
    expect(deepTween(new Map([['foo', 5]]), new Map(), 0)).toEqual(
      new Map([['foo', 5]]),
    );
  });

  test('waits to add new values to a map until a value of 1', () => {
    expect(deepTween(new Map(), new Map([['foo', 5]]), 3 / 5)).toEqual(
      new Map(),
    );
    expect(deepTween(new Map(), new Map([['foo', 5]]), 0)).toEqual(new Map());
  });

  test('adds new values to a map at a value of 1', () => {
    expect(deepTween(new Map(), new Map([['foo', 5]]), 1)).toEqual(
      new Map([['foo', 5]]),
    );
  });

  test('interpolates between values in an object', () => {
    expect(deepTween({foo: 0}, {foo: 5}, 3 / 5)).toEqual({foo: 3});
  });

  test('deletes values in a map after a value of 0', () => {
    expect(deepTween({foo: 5}, {}, 3 / 5)).toEqual({});
    expect(deepTween({foo: 5}, {}, 1)).toEqual({});
  });

  test('retains missing values in a map at a value of 0', () => {
    expect(deepTween({foo: 5}, {}, 0)).toEqual({foo: 5});
  });

  test('retains properties with falsy values', () => {
    expect(deepTween({x: 0, y: 10}, {x: 0, y: 20}, 0.5)).toEqual({x: 0, y: 15});
  });

  test('waits to add new values to a map until a value of 1', () => {
    expect(deepTween({}, {foo: 5}, 3 / 5)).toEqual({});
    expect(deepTween({}, {foo: 5}, 0)).toEqual({});
  });

  test('adds new values to a map at a value of 1', () => {
    expect(deepTween({}, {foo: 5}, 1)).toEqual({foo: 5});
  });

  test('replaces vector2dTween', () => {
    const args: [Vector2, Vector2, number] = [
      {x: 50, y: 65},
      {x: 10, y: 100},
      1 / 2,
    ];
    expect(deepTween(...args)).toEqual(vector2dTween(...args));
  });
});

describe('colorTween', () => {
  test('interpolates between colors', () => {
    expect(
      colorTween('rgb(0, 0, 0)', 'rgb(255, 255, 255)', 1 / 2),
    ).toMatchInlineSnapshot(`"rgb(50% 50% 50%)"`);
    expect(
      colorTween('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)', 1 / 2),
    ).toMatchInlineSnapshot(`"rgb(50% 50% 50%)"`);
  });
  test('returns starting value at 0', () => {
    expect(colorTween('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)', 0)).toEqual(
      'hsl(0, 0%, 0%)',
    );
  });
  test('returns final value at 1', () => {
    expect(colorTween('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)', 1)).toEqual(
      'hsl(0, 0%, 100%)',
    );
  });
});
