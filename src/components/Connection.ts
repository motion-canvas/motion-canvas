import {Node} from 'konva/lib/Node';
import {Center} from '../types';
import {KonvaNode} from '../decorators';
import {Pin, PIN_CHANGE_EVENT} from './Pin';
import {Group} from 'konva/lib/Group';
import {ContainerConfig} from 'konva/lib/Container';
import {Arrow} from './Arrow';
import {map} from '../tweening';

export interface ConnectionConfig extends ContainerConfig {
  start?: Pin;
  end?: Pin;
  startTarget?: Node;
  endTarget?: Node;
  crossing?: Node;
  arrow?: Arrow;
}

interface Measurement {
  direction: -1 | 0 | 1;
  range: [number, number];
  rangeOffset: [number, number];
  from: number;
  to: number;
  preferNegative: boolean;
}

function clamp(value: number, min: number, max: number): number {
  if (min > max) [min, max] = [max, min];
  return value < min ? min : value > max ? max : value;
}

@KonvaNode()
export class Connection extends Group {
  public readonly start: Pin;
  public readonly end: Pin;
  public readonly crossing: Node = null;
  public readonly arrow: Arrow;

  constructor(config?: ConnectionConfig) {
    super(config);

    this.start = config?.start ?? new Pin();
    this.start.on(PIN_CHANGE_EVENT, () => this.recalculate());
    if (!this.start.getParent()) {
      this.add(this.start);
    }

    this.end = config?.end ?? new Pin();
    this.end.on(PIN_CHANGE_EVENT, () => this.recalculate());
    if (!this.end.getParent()) {
      this.add(this.end);
    }

    if (config?.crossing) {
      this.crossing = config.crossing;
      this.crossing.on('absoluteTransformChange', () => this.recalculate());
    }

    this.arrow = config?.arrow ?? new Arrow();
    if (!this.arrow.getParent()) {
      this.add(this.arrow);
    }

    if (config?.startTarget) {
      this.start.target(config?.startTarget);
    }
    if (config?.endTarget) {
      this.end.target(config?.endTarget);
    }
  }

  private static measurePosition(
    positionA: number,
    sizeA: number,
    positionB: number,
    sizeB: number,
  ): Measurement {
    // FIXME use layout margin
    const padding = 20;
    const length = 20;
    const offset = (padding + length) * 2;

    let preferNegative = false;
    let direction: -1 | 0 | 1;
    let range: [number, number];
    let rangeOffset: [number, number];

    if (positionA - sizeA - offset > positionB + sizeB) {
      direction = -1;
      range = [positionA - sizeA - padding, positionB + sizeB + padding];
      rangeOffset = [range[0] - length, range[1] + length];
    } else if (positionA + sizeA + offset < positionB - sizeB) {
      direction = 1;
      range = [positionA + sizeA + padding, positionB - sizeB - padding];
      rangeOffset = [range[0] + length, range[1] - length];
    } else {
      direction = 0;

      if (
        Math.abs(positionA + sizeA - positionB - sizeB) >
        Math.abs(positionA - sizeA - positionB + sizeB)
      ) {
        range = [positionA - sizeA - padding, positionB - sizeB - padding];
        rangeOffset = [range[0] - length, range[1] - length];
      } else {
        preferNegative = true;
        range = [positionA + sizeA + padding, positionB + sizeB + padding];
        rangeOffset = [range[0] + length, range[1] + length];
      }
    }

    return {
      direction,
      range,
      rangeOffset,
      from: positionA,
      to: positionB,
      preferNegative,
    };
  }

  private static calculateCrossing(
    crossing: number,
    measurement: Measurement,
  ): number {
    const fractionX = crossing >= 0 && crossing <= 1;
    let clampedCrossing = crossing + measurement.from;
    if (measurement.direction !== 0 && !fractionX) {
      clampedCrossing = clamp(
        clampedCrossing,
        measurement.rangeOffset[0],
        measurement.rangeOffset[1],
      );
    }

    if (measurement.direction === 0) {
      return measurement.preferNegative
        ? Math.max(
            measurement.rangeOffset[0],
            measurement.rangeOffset[1],
            clampedCrossing,
          )
        : Math.min(
            measurement.rangeOffset[0],
            measurement.rangeOffset[1],
            clampedCrossing,
          );
    }

    return fractionX
      ? map(measurement.rangeOffset[0], measurement.rangeOffset[1], crossing)
      : clampedCrossing;
  }

  private recalculate() {
    if (!this.start || !this.end || !this.arrow) {
      this.arrow?.points([]);
      return;
    }

    const crossing = this.crossing
      ? this.crossing.getAbsolutePosition(this.getLayer())
      : {x: 0.5, y: 0.5};

    const fromRect = this.start.getClientRect({relativeTo: this.getLayer()});
    fromRect.width /= 2;
    fromRect.height /= 2;
    fromRect.x += fromRect.width;
    fromRect.y += fromRect.height;
    const toRect = this.end.getClientRect({relativeTo: this.getLayer()});

    toRect.width /= 2;
    toRect.height /= 2;
    toRect.x += toRect.width;
    toRect.y += toRect.height;

    const points: number[] = [];
    const horizontal = Connection.measurePosition(
      fromRect.x,
      fromRect.width,
      toRect.x,
      toRect.width,
    );
    const vertical = Connection.measurePosition(
      fromRect.y,
      fromRect.height,
      toRect.y,
      toRect.height,
    );

    if (this.start.direction() === Center.Vertical) {
      points.push(fromRect.x, vertical.range[0]);
    } else {
      points.push(horizontal.range[0], fromRect.y);
    }

    let endDirection = this.end.direction();
    if (this.start.direction() !== endDirection) {
      if (endDirection === Center.Vertical && vertical.direction === 0) {
        endDirection = this.start.direction();
      } else if (
        endDirection === Center.Horizontal &&
        horizontal.direction === 0
      ) {
        endDirection = this.start.direction();
      }
    }

    let distance = 100;
    if (this.start.direction() === endDirection) {
      if (endDirection === Center.Vertical) {
        distance = Math.abs(toRect.x - fromRect.x);
        if (distance >= 1) {
          const y = Connection.calculateCrossing(crossing.y, vertical);
          points.push(fromRect.x, y);
          points.push(toRect.x, y);
        }
      } else {
        distance = Math.abs(toRect.y - fromRect.y);
        if (distance >= 1) {
          const x = Connection.calculateCrossing(crossing.x, horizontal);
          points.push(x, fromRect.y);
          points.push(x, toRect.y);
        }
      }
    } else {
      if (endDirection === Center.Vertical) {
        points.push(toRect.x, fromRect.y);
      } else {
        points.push(fromRect.x, toRect.y);
      }
    }

    if (endDirection === Center.Vertical) {
      points.push(toRect.x, vertical.range[1]);
    } else {
      points.push(horizontal.range[1], toRect.y);
    }

    this.arrow.radius(Math.min(8, distance / 2));
    this.arrow.points(points);
  }
}
