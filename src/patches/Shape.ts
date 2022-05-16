import {Node} from 'konva/lib/Node';
import {Shape, ShapeGetClientRectConfig} from 'konva/lib/Shape';
import {IRect} from 'konva/lib/types';

declare module 'konva/lib/Shape' {
  export interface Shape {
    getShapeRect(config?: ShapeGetClientRectConfig): {
      width: number;
      height: number;
      x: number;
      y: number;
    };
  }
}

Shape.prototype.getShapeRect = Shape.prototype.getClientRect;
Shape.prototype.getClientRect = Node.prototype.getClientRect;
