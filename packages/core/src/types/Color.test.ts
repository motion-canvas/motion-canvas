import {describe, expect, test} from 'vitest';
import {Color} from './Color';

describe('Color.lerp', () => {
  test('interpolates between colors', () => {
    expect(
      Color.lerp('rgb(0, 0, 0)', 'rgb(255, 255, 255)', 1 / 2).css(),
    ).toMatchInlineSnapshot(`"rgb(119,119,119)"`);
    expect(
      Color.lerp('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)', 1 / 2).css(),
    ).toMatchInlineSnapshot(`"rgb(119,119,119)"`);
  });
  test('returns starting value at 0', () => {
    expect(Color.lerp('rgb(0, 0, 0)', 'rgb(255, 255, 255)', 0).css()).toEqual(
      'rgb(0,0,0)',
    );
  });
  test('returns final value at 1', () => {
    expect(Color.lerp('rgb(0, 0, 0)', 'rgb(255, 255, 255)', 1).css()).toEqual(
      'rgb(255,255,255)',
    );
  });
});
