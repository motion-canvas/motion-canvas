import {Shape} from './Shape';

export class Rect extends Shape {
  protected getPath(): Path2D {
    const path = new Path2D();
    const {width, height} = this.computedSize();
    path.rect(-width / 2, -height / 2, width, height);
    return path;
  }
}
