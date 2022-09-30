import {PossibleSpacing, Size} from '../types';
import {Util} from 'konva/lib/Util';
import {Context} from 'konva/lib/Context';
import * as THREE from 'three';
import {CanvasHelper} from '../helpers';
import {GetSet} from 'konva/lib/types';
import {KonvaNode, getset} from '../decorators';
import {Shape, ShapeConfig} from 'konva/lib/Shape';

export interface ThreeViewConfig extends ShapeConfig {
  canvasSize: Size;
  cameraScale?: number;
  quality?: number;
  skipFrames?: number;
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  radius?: PossibleSpacing;
  background?: string;
}

interface Pool<T> {
  borrow(): T;
  dispose(object: T): void;
}

class RendererPool implements Pool<THREE.WebGLRenderer> {
  private pool: THREE.WebGLRenderer[] = [];

  public borrow(): THREE.WebGLRenderer {
    if (this.pool.length) {
      return this.pool.pop();
    } else {
      return new THREE.WebGLRenderer({
        canvas: Util.createCanvasElement(),
        antialias: true,
      });
    }
  }

  public dispose(renderer: THREE.WebGLRenderer) {
    this.pool.push(renderer);
  }
}

const rendererPool = new RendererPool();

@KonvaNode()
export class ThreeView extends Shape {
  @getset(null)
  public scene: GetSet<ThreeViewConfig['scene'], this>;
  @getset(null)
  public camera: GetSet<ThreeViewConfig['camera'], this>;
  @getset({width: 0, height: 0}, ThreeView.prototype.handleCanvasSizeChange)
  public canvasSize: GetSet<ThreeViewConfig['canvasSize'], this>;
  @getset(1, ThreeView.prototype.handleCanvasSizeChange)
  public cameraScale: GetSet<ThreeViewConfig['cameraScale'], this>;
  @getset(1, ThreeView.prototype.handleCanvasSizeChange)
  public quality: GetSet<ThreeViewConfig['quality'], this>;
  @getset(0)
  public skipFrames: GetSet<ThreeViewConfig['skipFrames'], this>;
  @getset(0)
  public radius: GetSet<ThreeViewConfig['radius'], this>;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly context: WebGLRenderingContext;

  private renderedFrames = 0;

  public constructor(config?: ThreeViewConfig) {
    super(config);
    this.renderer = rendererPool.borrow();
    this.context = this.renderer.getContext();

    this.handleCanvasSizeChange();
  }

  public setBackground(value: string): this {
    const scene = this.scene();
    if (scene) {
      scene.background = new THREE.Color(value);
    }

    return this;
  }

  public getBackground(): string {
    const background = this.scene()?.background;
    return background instanceof THREE.Color
      ? background.getHexString()
      : '#000000';
  }

  public destroy(): this {
    rendererPool.dispose(this.renderer);

    return super.destroy();
  }

  private handleCanvasSizeChange() {
    if (!this.renderer) return;

    const size = {...this.canvasSize()};
    const camera = this.camera();

    const ratio = size.width / size.height;
    const scale = this.cameraScale() / 2;
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

    size.width *= this.quality();
    size.height *= this.quality();
    this.renderer.setSize(size.width, size.height);
    this.markDirty();
  }

  public getLayoutSize(): Size {
    return this.canvasSize();
  }

  public _sceneFunc(context: Context) {
    const scale = this.quality();
    const size = {...this.canvasSize()};

    if (this.renderedFrames < 1) {
      this.renderedFrames = this.skipFrames();
      this.renderer.render(this.scene(), this.camera());
    } else {
      this.renderedFrames--;
    }

    context._context.imageSmoothingEnabled = false;
    context._context.clip(
      CanvasHelper.roundRectPath(
        new Path2D(),
        size.width / -2,
        size.height / -2,
        size.width,
        size.height,
        this.radius(),
      ),
    );
    context._context.drawImage(
      this.renderer.domElement,
      0,
      0,
      size.width * scale,
      size.height * scale,
      size.width / -2,
      size.height / -2,
      size.width,
      size.height,
    );
  }
}
