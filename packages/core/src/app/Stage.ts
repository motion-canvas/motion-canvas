import {getContext} from '../utils';
import {Scene} from '../scenes';
import {CanvasColorSpace, Vector2} from '../types';
import type {Color} from '../types';

export interface StageSettings {
  size: Vector2;
  resolutionScale: number;
  colorSpace: CanvasColorSpace;
  background: Color | string | null;
}

/**
 * Manages canvases on which an animation can be displayed.
 */
export class Stage {
  // TODO Consider adding pooling for canvases.

  private background: string | null = null;
  private resolutionScale = 1;
  private colorSpace: CanvasColorSpace = 'srgb';
  private size = Vector2.zero;

  public readonly finalBuffer: HTMLCanvasElement;
  private readonly currentBuffer: HTMLCanvasElement;
  private readonly previousBuffer: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;
  private currentContext: CanvasRenderingContext2D;
  private previousContext: CanvasRenderingContext2D;

  private get canvasSize() {
    return this.size.scale(this.resolutionScale);
  }

  public constructor() {
    this.finalBuffer = document.createElement('canvas');
    this.currentBuffer = document.createElement('canvas');
    this.previousBuffer = document.createElement('canvas');

    const colorSpace = this.colorSpace;
    this.context = getContext({colorSpace}, this.finalBuffer);
    this.currentContext = getContext({colorSpace}, this.currentBuffer);
    this.previousContext = getContext({colorSpace}, this.previousBuffer);
  }

  public configure({
    colorSpace = this.colorSpace,
    size = this.size,
    resolutionScale = this.resolutionScale,
    background = this.background,
  }: Partial<StageSettings>) {
    if (colorSpace !== this.colorSpace) {
      this.colorSpace = colorSpace;
      this.context = getContext({colorSpace}, this.finalBuffer);
      this.currentContext = getContext({colorSpace}, this.currentBuffer);
      this.previousContext = getContext({colorSpace}, this.previousBuffer);
    }

    if (
      !size.exactlyEquals(this.size) ||
      resolutionScale !== this.resolutionScale
    ) {
      this.resolutionScale = resolutionScale;
      this.size = size;
      this.resizeCanvas(this.context);
      this.resizeCanvas(this.currentContext);
      this.resizeCanvas(this.previousContext);
    }

    this.background =
      typeof background === 'string'
        ? background
        : background?.serialize() ?? null;
  }

  public async render(currentScene: Scene, previousScene: Scene | null) {
    if (previousScene) {
      this.transformCanvas(this.previousContext);
      await previousScene.render(this.previousContext);
    }

    this.transformCanvas(this.currentContext);
    await currentScene.render(this.currentContext);

    const size = this.canvasSize;
    this.context.clearRect(0, 0, size.width, size.height);
    if (this.background) {
      this.context.save();
      this.context.fillStyle = this.background;
      this.context.fillRect(0, 0, size.width, size.height);
      this.context.restore();
    }

    if (previousScene) {
      this.context.drawImage(this.previousBuffer, 0, 0);
    }
    this.context.drawImage(this.currentBuffer, 0, 0);
  }

  public transformCanvas(context: CanvasRenderingContext2D) {
    const offset = this.canvasSize.scale(0.5);
    context.setTransform(
      this.resolutionScale,
      0,
      0,
      this.resolutionScale,
      offset.x,
      offset.y,
    );
  }

  public resizeCanvas(context: CanvasRenderingContext2D) {
    const size = this.canvasSize;
    context.canvas.width = size.width;
    context.canvas.height = size.height;
  }
}
