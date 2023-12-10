import {beforeEach, describe, expect, test, vi} from 'vitest';
import {LogLevel, Logger} from '../app';
import {Scene} from '../scenes';
import {BBox, Vector2} from '../types';
import {debug, startScene, useLogger} from '../utils';

describe('debug()', () => {
  beforeEach(() => {
    startScene({logger: new Logger()} as Scene);
  });

  test.each([
    ['Strings', 'test', {message: 'test'}],
    ['Numbers', 5, {message: '5'}],
    ['Null', null, {message: 'null'}],
    ['Undefined', undefined, {message: 'undefined'}],
    ['NaN', NaN, {message: 'NaN'}],
    ['Vector2', Vector2.one, {message: '{"x":1,"y":1}', object: Vector2.one}],
    [
      'BBox',
      new BBox([10, 20, 30, 40]),
      {
        message: '{"x":10,"y":20,"width":30,"height":40}',
        object: new BBox([10, 20, 30, 40]),
      },
    ],
    [
      'Arrays',
      [5, 'test', Vector2.one],
      {message: '[5,"test",{"x":1,"y":1}]', object: [5, 'test', Vector2.one]},
    ],
    ['Empty Array', [], {message: '[]', object: []}],
    [
      'Objects',
      {foo: 'bar', baz: 'qux'},
      {message: '{"foo":"bar","baz":"qux"}', object: {foo: 'bar', baz: 'qux'}},
    ],
    ['Empty Objects', {}, {message: '{}', object: {}}],
  ])('log: %s', (_, payload, expected) => {
    const spy = vi.fn();
    (useLogger() as Logger).onLogged.subscribe(spy);

    debug(payload);

    expect(spy).toHaveBeenNthCalledWith(1, {
      level: LogLevel.Debug,
      ...expected,
    });
  });
});
