import {Shape} from './Shape';

export class Circle extends Shape {
  protected getPath(): Path2D {
    const path = new Path2D();
    const {width, height} = this.computedLayout();
    path.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
    return path;
  }
}
