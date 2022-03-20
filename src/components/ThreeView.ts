import {LayoutShape, LayoutShapeConfig} from './LayoutShape';
import {Size} from '../types';
import {Util} from 'konva/lib/Util';
import {Context} from 'konva/lib/Context';
import * as THREE from 'three';
import {CanvasHelper} from '../helpers';

export interface ThreeViewConfig extends LayoutShapeConfig {
  canvasSize: Size;
  cameraScale?: number;
  quality?: number;
  skipFrames?: number;
  scene?: THREE.Scene;
  camera?: THREE.Camera;
}

interface Pool<T> {
  borrow(): T;
  dispose(object: T): void;
}

class CanvasPool implements Pool<HTMLCanvasElement> {
  private pool: HTMLCanvasElement[] = [];

  public borrow(): HTMLCanvasElement {
    if (this.pool.length) {
      return this.pool.pop();
    } else {
      return Util.createCanvasElement();
    }
  }

  public dispose(canvas: HTMLCanvasElement) {
    this.pool.push(canvas);
  }
}

const canvasPool2D = new CanvasPool();
const canvasPool3D = new CanvasPool();

export class ThreeView extends LayoutShape {
  private readonly threeCanvas: HTMLCanvasElement;
  private readonly copyCanvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly context: WebGLRenderingContext;
  private readonly copyContext: CanvasRenderingContext2D;

  private copyData: ImageData;
  private pixels: Uint8ClampedArray;
  private renderedFrames: number = 0;

  public constructor(config?: ThreeViewConfig) {
    super(config);
    this.threeCanvas = canvasPool3D.borrow();
    this.copyCanvas = canvasPool2D.borrow();
    this.copyContext = this.copyCanvas.getContext('2d');

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.threeCanvas,
      antialias: true,
    });
    this.context = this.renderer.getContext();

    this.handleCanvasSizeChange();
  }

  public setScene(value: THREE.Scene): this {
    this.attrs.scene = value;
    return this;
  }

  public getScene(): THREE.Scene {
    return this.attrs.scene ?? null;
  }

  public setCamera(value: THREE.Camera): this {
    this.attrs.camera = value;
    return this;
  }

  public getCamera<TCamera extends THREE.Camera>(): TCamera {
    return this.attrs.camera ?? null;
  }

  public setCanvasSize(value: Size): this {
    this.attrs.canvasSize = value;
    this.handleCanvasSizeChange();
    return this;
  }

  public getCanvasSize(): Size {
    return this.attrs.canvasSize
      ? {...this.attrs.canvasSize}
      : {width: 0, height: 0};
  }

  public setCameraScale(value: number): this {
    this.attrs.cameraScale = value;
    this.handleCanvasSizeChange();
    return this;
  }

  public getCameraScale(): number {
    return this.attrs.cameraScale ?? 1;
  }

  public setQuality(value: number): this {
    this.attrs.quality = value;
    this.handleCanvasSizeChange();
    return this;
  }

  public getQuality(): number {
    return this.attrs.quality ?? 1;
  }

  public setSkipFrames(value: number): this {
    this.attrs.skipFrames = value;
    return this;
  }

  public getSkipFrames(): number {
    return this.attrs.skipFrames ?? 0;
  }

  setColor(value: string): this {
    const scene = this.getScene();
    if (scene) {
      scene.background = new THREE.Color(value);
    }

    return this;
  }

  getColor(): string {
    const background = this.getScene()?.background;
    return background instanceof THREE.Color
      ? background.getHexString()
      : '#000000';
  }

  destroy(): this {
    this.renderer.dispose();
    canvasPool2D.dispose(this.copyCanvas);
    canvasPool3D.dispose(this.threeCanvas);

    return super.destroy();
  }

  private handleCanvasSizeChange() {
    if (!this.renderer) return;

    const size = this.getCanvasSize();
    const camera = this.getCamera();

    const ratio = size.width / size.height;
    const scale = this.getCameraScale() / 2;
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -ratio * scale;
      camera.right = ratio * scale;
      camera.bottom = -scale;
      camera.top = scale;
      camera.updateProjectionMatrix();
    } else if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = ratio;
      camera.updateProjectionMatrix();
    }

    size.width *= this.getQuality();
    size.height *= this.getQuality();
    this.renderer.setSize(size.width, size.height);
    this.copyCanvas.width = size.width;
    this.copyCanvas.height = size.height;
    this.copyData = this.copyContext.createImageData(size.width, size.height);
    this.pixels = new Uint8ClampedArray(size.width * size.height * 4);
  }

  getLayoutSize(): Size {
    return this.getCanvasSize();
  }

  _sceneFunc(context: Context) {
    const scale = this.getQuality();
    const size = this.getCanvasSize();
    size.width *= scale;
    size.height *= scale;

    if (this.renderedFrames < 1) {
      this.renderedFrames = this.getSkipFrames();
      this.renderer.render(this.getScene(), this.getCamera());
      this.context.readPixels(
        0,
        0,
        size.width,
        size.height,
        this.context.RGBA,
        this.context.UNSIGNED_BYTE,
        this.pixels,
      );

      this.copyData.data.set(this.pixels);
      this.copyContext.putImageData(this.copyData, 0, 0);
    } else {
      this.renderedFrames--;
    }

    context.save();
    context._context.imageSmoothingEnabled = false;
    context.scale(1 / scale, 1 / -scale);

    CanvasHelper.roundRect(
      context._context,
      size.width / -2,
      size.height / -2,
      size.width,
      size.height,
      this.getRadius(),
    );
    context.clip();
    context.drawImage(
      this.copyCanvas,
      0,
      0,
      size.width,
      size.height,
      size.width / -2,
      size.height / -2,
      size.width,
      size.height,
    );
    context.restore();
  }
}
