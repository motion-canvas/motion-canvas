import {describe, expect, test, vi} from 'vitest';
import {Vector2} from '../types';
import {deepLerp} from './interpolationFunctions';

describe('deepLerp', () => {
  test('falls back to primitive tween for numbers', () => {
    expect(deepLerp(5, 10, 3 / 5)).toEqual(8);
  });

  test('falls back to primitive tween for strings', () => {
    expect(deepLerp('foo', 'foobar', 2 / 3)).toEqual('fooba');
  });

  test('interpolates between values in an array', () => {
    expect(deepLerp([0, 2], [1, 3], 1 / 2)).toEqual([0.5, 2.5]);
  });

  test('jumps to new array if values vary in length', () => {
    expect(deepLerp([0, 2], [1, 3, 5], 0)).toEqual([0, 2]);
    expect(deepLerp([0, 2], [1, 3, 5], 1 / 2)).toEqual([1, 3, 5]);
    expect(deepLerp([0, 2], [1, 3, 5], 1)).toEqual([1, 3, 5]);
  });

  test('interpolates between values in a map', () => {
    expect(
      deepLerp(new Map([['foo', 0]]), new Map([['foo', 5]]), 3 / 5),
    ).toEqual(new Map([['foo', 3]]));
  });

  test('deletes values in a map after a value of 0', () => {
    expect(deepLerp(new Map([['foo', 5]]), new Map(), 3 / 5)).toEqual(
      new Map(),
    );
    expect(deepLerp(new Map([['foo', 5]]), new Map(), 1)).toEqual(new Map());
  });

  test('retains missing values in a map at a value of 0', () => {
    expect(deepLerp(new Map([['foo', 5]]), new Map(), 0)).toEqual(
      new Map([['foo', 5]]),
    );
  });

  test('waits to add new values to a map until a value of 1', () => {
    expect(deepLerp(new Map(), new Map([['foo', 5]]), 3 / 5)).toEqual(
      new Map(),
    );
    expect(deepLerp(new Map(), new Map([['foo', 5]]), 0)).toEqual(new Map());
  });

  test('adds new values to a map at a value of 1', () => {
    expect(deepLerp(new Map(), new Map([['foo', 5]]), 1)).toEqual(
      new Map([['foo', 5]]),
    );
  });

  test('interpolates between values in an object', () => {
    expect(deepLerp({foo: 0}, {foo: 5}, 3 / 5)).toEqual({foo: 3});
  });

  test('deletes values in a map after a value of 0', () => {
    expect(deepLerp({foo: 5}, {}, 3 / 5)).toEqual({});
    expect(deepLerp({foo: 5}, {}, 1)).toEqual({});
  });

  test('retains missing values in a map at a value of 0', () => {
    expect(deepLerp({foo: 5}, {}, 0)).toEqual({foo: 5});
  });

  test('retains properties with falsy values', () => {
    expect(deepLerp({x: 0, y: 10}, {x: 0, y: 20}, 0.5)).toEqual({x: 0, y: 15});
  });

  test('waits to add new values to a map until a value of 1', () => {
    expect(deepLerp({}, {foo: 5}, 3 / 5)).toEqual({});
    expect(deepLerp({}, {foo: 5}, 0)).toEqual({});
  });

  test('adds new values to a map at a value of 1', () => {
    expect(deepLerp({}, {foo: 5}, 1)).toEqual({foo: 5});
  });

  test('invokes native interpolation function', () => {
    const spy = vi.spyOn(Vector2, 'lerp');
    const args: [Vector2, Vector2, number] = [
      new Vector2(50, 65),
      new Vector2(10, 100),
      1 / 2,
    ];
    expect(deepLerp(...args)).toEqual(Vector2.lerp(...args));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('returns the from boolean until a value of 0.5', () => {
    expect(deepLerp(true, false, 0)).toBe(true);
    expect(deepLerp(true, false, 0.25)).toBe(true);
    expect(deepLerp(true, false, 0.499999)).toBe(true);
  });

  test('returns the to boolean after a value of 0.5 or greater', () => {
    expect(deepLerp(true, false, 0.5)).toBe(false);
    expect(deepLerp(true, false, 0.75)).toBe(false);
    expect(deepLerp(true, false, 0.99999)).toBe(false);
    expect(deepLerp(true, false, 1)).toBe(false);
  });
});
