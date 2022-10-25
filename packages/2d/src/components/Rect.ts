import {Signal} from '@motion-canvas/core/lib/utils';
import {Shape, ShapeProps} from './Shape';
import {property} from '../decorators';

export interface RectProps extends ShapeProps {
  radius?: number;
}

export class Rect extends Shape {
  @property(0)
  public declare readonly radius: Signal<number, this>;

  public constructor(props: RectProps) {
    super(props);
  }

  protected override getPath(): Path2D {
    const path = new Path2D();
    const radius = this.radius();
    const {width, height} = this.size();
    const x = width / -2;
    const y = height / -2;

    if (radius > 0) {
      const maxRadius = Math.min(height / 2, width / 2, radius);
      path.moveTo(x + maxRadius, y);
      path.arcTo(x + width, y, x + width, y + height, maxRadius);
      path.arcTo(x + width, y + height, x, y + height, maxRadius);
      path.arcTo(x, y + height, x, y, maxRadius);
      path.arcTo(x, y, x + width, y, maxRadius);
    } else {
      path.rect(x, y, width, height);
    }

    return path;
  }
}
