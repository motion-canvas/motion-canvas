import {Arrow, ArrowConfig} from './Arrow';
import {Node} from 'konva/lib/Node';
import {_registerNode} from 'konva/lib/Global';
import {Factory} from 'konva/lib/Factory';
import {GetSet, Vector2d} from 'konva/lib/types';
import {Direction} from '../types/Origin';
import {Context} from 'konva/lib/Context';
import {TimeTween} from '../tweening';

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
  constructor(config?: ConnectionConfig) {
    super(config);
  }

  private measurePosition(
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

  private calculateCrossing(
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
      if (!this.attrs.from || !this.attrs.to) {
        this.attrs.points = [];
      } else {
        const from: ConnectionPoint = this.attrs.from;
        const to: ConnectionPoint = this.attrs.to;

        const fromPosition = from.node.absolutePosition();
        const fromSize = from.node.size();
        fromSize.width /= 2;
        fromSize.height /= 2;
        const toPosition = to.node.absolutePosition();
        const toSize = to.node.size();
        toSize.width /= 2;
        toSize.height /= 2;

        this.attrs.points = [];
        const horizontal = this.measurePosition(
          fromPosition.x,
          fromSize.width,
          toPosition.x,
          toSize.width,
        );
        const vertical = this.measurePosition(
          fromPosition.y,
          fromSize.height,
          toPosition.y,
          toSize.height,
        );

        if (from.vertical) {
          this.attrs.points.push(fromPosition.x, vertical.range[0]);
        } else {
          this.attrs.points.push(horizontal.range[0], fromPosition.y);
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
            distance = Math.abs(toPosition.x - fromPosition.x);
            if (distance > 0) {
              const y = this.calculateCrossing(this.attrs.crossing.y, vertical);
              this.attrs.points.push(fromPosition.x, y);
              this.attrs.points.push(toPosition.x, y);
            }
          } else {
            distance = Math.abs(toPosition.y - fromPosition.y);
            if (distance > 0) {
              const x = this.calculateCrossing(
                this.attrs.crossing.x,
                horizontal,
              );
              this.attrs.points.push(x, fromPosition.y);
              this.attrs.points.push(x, toPosition.y);
            }
          }
        } else {
          if (from.vertical) {
            this.attrs.points.push(fromPosition.x, toPosition.y);
          } else {
            this.attrs.points.push(toPosition.x, fromPosition.y);
          }
        }

        if (toVertical) {
          this.attrs.points.push(toPosition.x, vertical.range[1]);
        } else {
          this.attrs.points.push(horizontal.range[1], toPosition.y);
        }

        this.attrs.radius = Math.min(8, distance / 2);
      }
    }

    super._sceneFunc(context);
  }

  private previousFromNode: Node | null = null;
  public fromChanged() {
    if (this.previousFromNode === this.attrs.from?.node) return;
    this.markAsDirtyCallback ??= () => this.markAsDirty();

    this.previousFromNode?.off(
      'absoluteTransformChange',
      this.markAsDirtyCallback,
    );
    this.previousFromNode = this.attrs.from?.node;
    this.previousFromNode?.on(
      'absoluteTransformChange',
      this.markAsDirtyCallback,
    );
    this.markAsDirty();
  }

  private previousToNode: Node | null = null;
  public toChanged() {
    if (this.previousToNode === this.attrs.to?.node) return;
    this.markAsDirtyCallback ??= () => this.markAsDirty();

    this.previousToNode?.off(
      'absoluteTransformChange',
      this.markAsDirtyCallback,
    );
    this.previousToNode = this.attrs.to?.node;
    this.previousToNode?.on(
      'absoluteTransformChange',
      this.markAsDirtyCallback,
    );
    this.markAsDirty();
  }

  private markAsDirtyCallback = () => {
    this.markAsDirty();
  };

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
  Connection.prototype.fromChanged,
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
  Connection.prototype.toChanged,
);
Factory.addGetterSetter(
  Connection,
  'crossing',
  {x: 0, y: 0},
  undefined,
  Connection.prototype.markAsDirty,
);
