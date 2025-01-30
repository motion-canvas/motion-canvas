// BezierMath.test.ts

import {beforeEach, describe, expect, it} from 'vitest';
import {BezierMath, newBezierMath} from './bezierMath';

describe('BezierMath Implementation', () => {
  const x1 = 0.42;
  const y1 = 0.0;
  const x2 = 0.58;
  const y2 = 1.0;
  const newtonIterations = 10;
  const approximation = 0.0001;

  let bezier: BezierMath;

  beforeEach(() => {
    bezier = newBezierMath(x1, y1, x2, y2);
  });

  describe('Constructor and Getters', () => {
    it('should correctly set newtonIterations and approximation', () => {
      expect(bezier.getNewtonIterations()).toBe(newtonIterations);
      expect(bezier.getApproximation()).toBe(approximation);
    });
  });

  // https://www.desmos.com/calculator/ep6s3nrev8
  it('should handle t values between 0 and 1', () => {
    const testValues: Array<{t: number; expected: number}> = [
      {t: 0, expected: 0},
      {t: 0.25, expected: 0.1291}, // Approximate expected value
      {t: 0.75, expected: 0.8708}, // Approximate expected value
      {t: 1, expected: 1},
    ];

    testValues.forEach(({t, expected}) => {
      expect(bezier.solve(t)).toBeCloseTo(expected, 3);
    });
  });

  it('should handle edge cases where derivative is near zero', () => {
    // Control points that create a horizontal tangent
    const horizontalBezier = newBezierMath(0.0, 0.5, 1.0, 0.5);
    expect(horizontalBezier.solve(0.5)).toBeCloseTo(0.5, 5);
  });
});

describe('Factory Function', () => {
  it('should create an instance of BezierMath', () => {
    const bezierInstance = newBezierMath(0.3, 0.6, 0.7, 0.9);
    expect(bezierInstance).toHaveProperty('solve');
    expect(bezierInstance).toHaveProperty('getNewtonIterations');
    expect(bezierInstance).toHaveProperty('getApproximation');
  });
});

describe('Integration Tests with Known Bezier Curves', () => {
  it('should match expected y values for specific t on a linear Bezier curve', () => {
    // Linear Bezier curve (straight line): y = t
    const linearBezier = newBezierMath(0, 0, 1, 1);
    for (let t = 0; t <= 1; t += 0.1) {
      expect(linearBezier.solve(t)).toBeCloseTo(t, 4);
    }
  });

  it('should match expected y values for specific t on Bezier curve', () => {
    // Example control points for a specific curve
    const bezierCurve = newBezierMath(0.25, 0.1, 0.25, 1.0);
    const testValues: Array<{t: number; expected: number}> = [
      {t: 0.0, expected: 0.0},
      {t: 0.25, expected: 0.4085},
      {t: 0.5, expected: 0.8024},
      {t: 0.75, expected: 0.9604},
      {t: 1.0, expected: 1.0},
    ];

    testValues.forEach(({t, expected}) => {
      expect(bezierCurve.solve(t)).toBeCloseTo(expected, 3);
    });
  });
});
