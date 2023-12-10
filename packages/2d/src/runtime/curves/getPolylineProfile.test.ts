import {Vector2} from '@motion-canvas/core';
import {describe, expect, test} from 'vitest';
import {getPolylineProfile} from './getPolylineProfile';

describe('getPolylineProfile', () => {
  test('Correct arc length', () => {
    const profile = getPolylineProfile(
      [
        Vector2.zero,
        Vector2.zero,
        new Vector2(100, 0),
        new Vector2(100, 100),
        new Vector2(0, 100),
      ],
      0,
      true,
    );

    expect(profile.arcLength).toBe(400);
  });
});
