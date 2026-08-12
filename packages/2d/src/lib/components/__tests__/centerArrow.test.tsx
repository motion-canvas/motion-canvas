import {beforeAll, describe, expect, it} from 'vitest';
import {Line} from '../Line';
import {mockScene2D} from './mockScene2D';

class Path2DMock {
  public addPath() {}
  public closePath() {}
  public moveTo() {}
  public lineTo() {}
  public bezierCurveTo() {}
  public quadraticCurveTo() {}
  public arc() {}
  public arcTo() {}
  public ellipse() {}
  public rect() {}
}

describe('centerArrow', () => {
  mockScene2D();

  beforeAll(() => {
    (globalThis as any).Path2D = Path2DMock;
  });

  it('Default centerArrow is false', () => {
    const line = (
      <Line
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={'white'}
        lineWidth={4}
      />
    ) as Line;

    expect(line.centerArrow()).toBe(false);
  });

  it('Can enable centerArrow', () => {
    const line = (
      <Line
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={'white'}
        lineWidth={4}
        centerArrow
      />
    ) as Line;

    expect(line.centerArrow()).toBe(true);
  });

  it('Computes center point at midpoint of a horizontal line', () => {
    const line = (
      <Line
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={'white'}
        lineWidth={4}
        centerArrow
      />
    ) as Line;

    const info = (line as any).curveDrawingInfo();
    expect(info.centerPoint.x).toBeCloseTo(0, 1);
    expect(info.centerPoint.y).toBeCloseTo(0, 1);
  });

  it('Center tangent points along the curve direction', () => {
    const line = (
      <Line
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={'white'}
        lineWidth={4}
        centerArrow
      />
    ) as Line;

    const info = (line as any).curveDrawingInfo();
    const tangent = info.centerTangent;
    expect(Math.abs(tangent.x)).toBeGreaterThan(0.9);
    expect(tangent.y).toBeCloseTo(0, 5);
  });

  it('Requires profile when centerArrow is set', () => {
    const line = (
      <Line
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={'white'}
        lineWidth={4}
        centerArrow
      />
    ) as Line;

    expect((line as any).requiresProfile()).toBe(true);
  });

  it('Does not require profile when no arrows are set', () => {
    const line = (
      <Line
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={'white'}
        lineWidth={4}
      />
    ) as Line;

    expect((line as any).requiresProfile()).toBe(false);
  });

  it('Works alongside startArrow and endArrow', () => {
    const line = (
      <Line
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={'white'}
        lineWidth={4}
        startArrow
        endArrow
        centerArrow
      />
    ) as Line;

    expect(line.startArrow()).toBe(true);
    expect(line.endArrow()).toBe(true);
    expect(line.centerArrow()).toBe(true);

    const info = (line as any).curveDrawingInfo();
    expect(info.arrowSize).toBeGreaterThan(0);
    expect(info.centerPoint).toBeDefined();
    expect(info.centerTangent).toBeDefined();
  });

  it('Computes center point on a multi-segment line', () => {
    const line = (
      <Line
        points={[
          [-100, -100],
          [0, 0],
          [100, -100],
        ]}
        stroke={'white'}
        lineWidth={4}
        centerArrow
      />
    ) as Line;

    const info = (line as any).curveDrawingInfo();
    expect(info.centerPoint.x).toBeCloseTo(0, 1);
    expect(info.centerPoint.y).toBeCloseTo(0, 1);
  });

  it('Cache bbox accounts for centerArrow size', () => {
    const lineWithout = (
      <Line
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={'white'}
        lineWidth={4}
      />
    ) as Line;

    const lineWith = (
      <Line
        points={[
          [-100, 0],
          [100, 0],
        ]}
        stroke={'white'}
        lineWidth={4}
        centerArrow
        arrowSize={48}
      />
    ) as Line;

    const bboxWithout = (lineWithout as any).getCacheBBox();
    const bboxWith = (lineWith as any).getCacheBBox();

    expect(bboxWith.width).toBeGreaterThanOrEqual(bboxWithout.width);
    expect(bboxWith.height).toBeGreaterThanOrEqual(bboxWithout.height);
  });
});
