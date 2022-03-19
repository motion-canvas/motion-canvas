import {LayoutShape, LayoutShapeConfig} from './LayoutShape';
import {Size} from '../types';
import {Util} from 'konva/lib/Util';
import {Context} from 'konva/lib/Context';

import * as THREE from 'three';
import {GetSet} from 'konva/lib/types';
import {Factory} from 'konva/lib/Factory';

export interface ThreeViewConfig extends LayoutShapeConfig {
  canvasSize: Size;
  cameraScale?: number;
  quality?: number;
  skipFrames?: number;
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
  public canvasSize: GetSet<Size, this>;
  public cameraScale: GetSet<number, this>;
  public quality: GetSet<number, this>;
  public skipFrames: GetSet<number, this>;
  public readonly scene: THREE.Scene;
  public readonly camera: THREE.OrthographicCamera;

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

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x568585);
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.threeCanvas,
      antialias: true,
    });
    this.context = this.renderer.getContext();
    this.camera.position.z = 3;
    this.camera.position.y = 2;

    this.handleCanvasSizeChange();
  }

  destroy(): this {
    this.renderer.dispose();
    canvasPool2D.dispose(this.copyCanvas);
    canvasPool3D.dispose(this.threeCanvas);

    return super.destroy();
  }

  private handleCanvasSizeChange() {
    if (!this.renderer) return;

    const size = {...this.canvasSize()};

    const ratio = size.width / size.height;
    const scale = this.cameraScale() / 2;
    this.camera.left = -ratio * scale;
    this.camera.right = ratio * scale;
    this.camera.bottom = -scale;
    this.camera.top = scale;

    size.width *= this.quality();
    size.height *= this.quality();
    this.renderer.setSize(size.width, size.height);
    this.camera.updateProjectionMatrix();
    this.copyCanvas.width = size.width;
    this.copyCanvas.height = size.height;
    this.copyData = this.copyContext.createImageData(size.width, size.height);
    this.pixels = new Uint8ClampedArray(size.width * size.height * 4);
  }

  getLayoutSize(): Size {
    return this.canvasSize();
  }

  _sceneFunc(context: Context) {
    const scale = this.quality();
    const size = {...this.canvasSize()};
    size.width *= scale;
    size.height *= scale;

    if (this.renderedFrames < 1) {
      this.renderedFrames = this.skipFrames();
      this.renderer.render(this.scene, this.camera);
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
    context.drawImage(
      this.copyCanvas,
      // this.copyImage,
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

Factory.addGetterSetter(
  ThreeView,
  'canvasSize',
  {width: 1, height: 1},
  undefined,
  //@ts-ignore
  ThreeView.handleCanvasSizeChange,
);
Factory.addGetterSetter(
  ThreeView,
  'cameraScale',
  1,
  undefined,
  //@ts-ignore
  ThreeView.handleCanvasSizeChange,
);
Factory.addGetterSetter(
  ThreeView,
  'quality',
  1,
  undefined,
  //@ts-ignore
  ThreeView.handleCanvasSizeChange,
);
Factory.addGetterSetter(ThreeView, 'skipFrames', 0);
