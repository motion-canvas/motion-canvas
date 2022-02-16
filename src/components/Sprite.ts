import {Shape, ShapeConfig} from 'konva/lib/Shape';
import {Context} from 'konva/lib/Context';
import {Util} from 'konva/lib/Util';

export interface SpriteConfig extends ShapeConfig {
  image: string;
}

export class Sprite extends Shape {
  private image: HTMLImageElement;

  constructor(config?: SpriteConfig) {
    super(config);
    this.image = Util.createImageElement();
    this.image.src = config?.image;
  }

  _sceneFunc(context: Context) {
    context._context.imageSmoothingEnabled = false;
    context.drawImage(this.image, -24 * 20, -24 * 20, 24 * 40, 24 * 40);
  }
}
