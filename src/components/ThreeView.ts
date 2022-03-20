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

const canvasPool3D = new CanvasPool();

export class ThreeView extends LayoutShape {
  private readonly threeCanvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly context: WebGLRenderingContext;

  private renderedFrames: number = 0;

  public constructor(config?: ThreeViewConfig) {
    super(config);
    this.threeCanvas = canvasPool3D.borrow();

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
  }

  getLayoutSize(): Size {
    return this.getCanvasSize();
  }

  _sceneFunc(context: Context) {
    const scale = this.getQuality();
    const size = this.getCanvasSize();

    if (this.renderedFrames < 1) {
      this.renderedFrames = this.getSkipFrames();
      this.renderer.render(this.getScene(), this.getCamera());
    } else {
      this.renderedFrames--;
    }

    context._context.save();
    context._context.imageSmoothingEnabled = false;

    context._context.clip(
      CanvasHelper.roundRectPath(
        new Path2D(),
        size.width / -2,
        size.height / -2,
        size.width,
        size.height,
        this.getRadius(),
      ),
    );
    context._context.drawImage(
      this.threeCanvas,
      0,
      0,
      size.width * scale,
      size.height * scale,
      size.width / -2,
      size.height / -2,
      size.width,
      size.height,
    );
    context._context.restore();
  }
}
