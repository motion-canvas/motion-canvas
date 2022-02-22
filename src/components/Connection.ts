import {Arrow, ArrowConfig} from './Arrow';
import {Node} from 'konva/lib/Node';
import {_registerNode} from 'konva/lib/Global';
import {Factory} from 'konva/lib/Factory';
import {GetSet, Vector2d} from 'konva/lib/types';
import {Direction} from '../types/Origin';
import {Context} from 'konva/lib/Context';
import {TimeTween} from '../animations';
import {SURFACE_CHANGE_EVENT} from './Surface';
import {Project} from '../Project';

export interface ConnectionPoint {
  node: Node;
  direction: Direction;
  offset: number;
  vertical?: boolean;
}

export interface ConnectionConfig extends ArrowConfig {
  from: ConnectionPoint;
  to: ConnectionPoint;
  crossing: Vector2d;
}

interface Measurement {
  direction: -1 | 0 | 1;
  range: [number, number];
  rangeOffset: [number, number];
  from: number;
  to: number;
}

function clamp(value: number, min: number, max: number): number {
  if (min > max) [min, max] = [max, min];
  return value < min ? min : value > max ? max : value;
}

export class Connection extends Arrow {
  private nodeCache: Record<string, Node> = {};
  private markAsDirtyCallback: () => void;

  public get project(): Project {
    return <Project>this.getStage();
  }

  constructor(config?: ConnectionConfig) {
    super(config);
  }

  private static measurePosition(
    positionA: number,
    sizeA: number,
    positionB: number,
    sizeB: number,
  ): Measurement {
    let direction: -1 | 0 | 1;
    let range: [number, number];
    let rangeOffset: [number, number];

    if (positionA - sizeA - 80 > positionB + sizeB) {
      direction = -1;
      range = [positionA - sizeA - 20, positionB + sizeB + 20];
      rangeOffset = [range[0] - 20, range[1] + 20];
    } else if (positionA + sizeA + 80 < positionB - sizeB) {
      direction = 1;
      range = [positionA + sizeA + 20, positionB - sizeB - 20];
      rangeOffset = [range[0] + 20, range[1] - 20];
    } else {
      direction = 0;
      range = [positionA - sizeA - 20, positionB - sizeB - 20];
      rangeOffset = [range[0] - 20, range[1] - 20];
    }

    return {direction, range, rangeOffset, from: positionA, to: positionB};
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

    return measurement.direction === 0
      ? Math.min(
          measurement.rangeOffset[0],
          measurement.rangeOffset[1],
          clampedCrossing,
        )
      : fractionX
      ? TimeTween.map(
          measurement.rangeOffset[0],
          measurement.rangeOffset[1],
          crossing,
        )
      : clampedCrossing;
  }

  _sceneFunc(context: Context) {
    if (this.dirty) {
      this.recalculate();
    }

    super._sceneFunc(context);
  }

  private recalculate() {
    const from: ConnectionPoint = this.from();
    const to: ConnectionPoint = this.to();
    const crossing = this.crossing();

    if (!from.node || !to.node) {
      this.points([]);
      return;
    }

    const fromRect = from.node.getClientRect({relativeTo: this.getLayer()});
    fromRect.width /= 2;
    fromRect.height /= 2;
    fromRect.x += fromRect.width;
    fromRect.y += fromRect.height;
    const toRect = to.node.getClientRect({relativeTo: this.getLayer()});

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

    if (from.vertical) {
      points.push(fromRect.x, vertical.range[0]);
    } else {
      points.push(horizontal.range[0], fromRect.y);
    }

    let toVertical = to.vertical;
    if (
      from.vertical !== toVertical &&
      (horizontal.direction === 0 || vertical.direction === 0)
    ) {
      toVertical = from.vertical;
    }

    let distance = 100;
    if (from.vertical === toVertical) {
      if (from.vertical) {
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
      if (from.vertical) {
        points.push(fromRect.x, toRect.y);
      } else {
        points.push(toRect.x, fromRect.y);
      }
    }

    if (toVertical) {
      points.push(toRect.x, vertical.range[1]);
    } else {
      points.push(horizontal.range[1], toRect.y);
    }

    this.radius(Math.min(8, distance / 2));
    this.points(points);
  }

  public nodeChanged(name: string, node: Node) {
    this.nodeCache ??= {};
    this.markAsDirtyCallback ??= () => this.markAsDirty();

    if (this.nodeCache[name] === node) return;

    this.nodeCache[name]
      ?.off('absoluteTransformChange', this.markAsDirtyCallback)
      .off(SURFACE_CHANGE_EVENT, this.markAsDirtyCallback);
    this.nodeCache[name] = node;
    this.nodeCache[name]
      ?.on('absoluteTransformChange', this.markAsDirtyCallback)
      .on(SURFACE_CHANGE_EVENT, this.markAsDirtyCallback);
    this.markAsDirty();
  }

  from: GetSet<ConnectionPoint, this>;
  to: GetSet<ConnectionPoint, this>;
  crossing: GetSet<Vector2d, this>;
}

Connection.prototype.className = 'Connection';
Connection.prototype._attrsAffectingSize = ['from', 'to'];

_registerNode(Arrow);

Factory.addGetterSetter(
  Connection,
  'from',
  {
    node: null,
    direction: Direction.Right,
    offset: 0,
  },
  undefined,
  function (this: Connection) {
    this.nodeChanged('from', this.from().node);
  },
);

Factory.addGetterSetter(
  Connection,
  'to',
  {
    node: null,
    direction: Direction.Right,
    offset: 0,
  },
  undefined,
  function (this: Connection) {
    this.nodeChanged('to', this.to().node);
  },
);
Factory.addGetterSetter(
  Connection,
  'crossing',
  {x: 0, y: 0},
  undefined,
  Connection.prototype.markAsDirty,
);
