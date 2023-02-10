import {describe, test, beforeEach, expect, vi} from 'vitest';
import {setProject, useLogger, debug} from '../utils';
import {Project, ProjectMetadata} from '../Project';
import {Meta} from '../Meta';
import {LogLevel, LogPayload} from '../Logger';
import {Rect, Vector2} from '../types';

describe('debug()', () => {
  beforeEach(() => {
    setProject(new Project({name: 'test', scenes: []}));
  });

  test.each([
    ['Strings', 'test', {message: 'test'}],
    ['Numbers', 5, {message: '5'}],
    ['Null', null, {message: 'null'}],
    ['Undefined', undefined, {message: 'undefined'}],
    ['NaN', NaN, {message: 'NaN'}],
    ['Vector2', Vector2.one, {message: '{"x":1,"y":1}', object: Vector2.one}],
    [
      'Rect',
      new Rect([10, 20, 30, 40]),
      {
        message: '{"x":10,"y":20,"width":30,"height":40}',
        object: new Rect([10, 20, 30, 40]),
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
    useLogger().onLogged.subscribe(spy);

    debug(payload);

    expect(spy).toHaveBeenNthCalledWith(1, {
      level: LogLevel.Debug,
      ...expected,
    });
  });
});
