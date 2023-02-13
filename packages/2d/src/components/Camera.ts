import {all} from '@motion-canvas/core/lib/flow';
import {SimpleSignal} from '@motion-canvas/core/lib/signals';
import {ThreadGenerator} from '@motion-canvas/core/lib/threading';
import {easeInOutCubic, TimingFunction} from '@motion-canvas/core/lib/tweening';
import {PossibleRect, Rect, Vector2} from '@motion-canvas/core/lib/types';
import {Layout, LayoutProps, Node} from '.';
import {computed, initial, signal} from '../decorators';

export interface CameraViewProps
  extends Omit<LayoutProps, 'scale' | 'position'> {
  scene?: Node;
  baseZoom?: number;
}

export class Camera extends Layout {
  private translation = Vector2.createSignal(0);

  @initial(1)
  @signal()
  public declare readonly baseZoom: SimpleSignal<number, this>;

  @initial(null)
  @signal()
  public declare readonly scene: SimpleSignal<Node | null, this>;

  public constructor(props: CameraViewProps) {
    super({
      clip: true,
      ...props,
      scale: props.baseZoom ?? 1,
      position: () => this.actualPosition(),
    });
  }

  @computed()
  private rotationMatrix(): DOMMatrix {
    const matrix = new DOMMatrix();
    matrix.rotateSelf(0, 0, this.rotation());
    return matrix;
  }

  @computed()
  private actualPosition() {
    return this.translation()
      .mul(this.scale())
      .transformAsPoint(this.rotationMatrix());
  }

  /**
   * Resets the camera's viewport to its original position, scale and rotation.
   *
   * @param duration - The duration of the transition
   * @param timing - The timing function to use for the transition
   */
  public *reset(
    duration = 1,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    yield* all(
      this.scale(this.baseZoom(), duration, timing),
      this.translation(Vector2.zero, duration, timing),
      this.rotation(0, duration, timing),
    );
  }

  /**
   * Zooms the camera onto the current position.
   *
   * @param zoom - The zoom level that should get applied as a percentage of the base zoom level.  1 means no zoom.
   * @param duration - The duration of the transition
   * @param timing - The timing function used for the transition
   */
  public *zoom(
    zoom: number,
    duration = 1,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    yield* this.scale(zoom * this.baseZoom(), duration, timing);
  }

  /**
   * Resets the camera's zoom without changing it's position.
   *
   * @param duration - The duration of the transition
   * @param timing - The timing function to use for the transition
   */
  public *resetZoom(
    duration = 1,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    yield* this.scale(this.baseZoom(), duration, timing);
  }

  /**
   * Rotates the camera around its current position.
   *
   * @param angle - The rotation to apply in degrees
   * @param duration - The duration of the transition
   * @param timing - The timing function to use for the transition
   */
  public *rotate(
    angle: number,
    duration = 1,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    yield* this.rotation(this.rotation() + angle, duration, timing);
  }

  /**
   * Resets the camera's rotation.
   *
   * @param duration - The duration of the transition
   * @param timing - The timing function to use for the transition
   */
  public *resetRotation(
    duration = 1,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    yield* this.rotation(0, duration, timing);
  }

  /**
   * Shifts the camera into the provided direction.
   *
   * @param by - The amount and direction in which to shift the camera
   * @param duration - The duration of the transition
   * @param timing - The timing function used for the transition
   */
  public *shift(
    by: Vector2,
    duration = 1,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    yield* this.translation(this.translation().sub(by), duration, timing);
  }

  /**
   * Zooms the view onto the provided area until it fills out the viewport.
   * Can optionally apply a buffer around the target area.
   *
   * @param area - The area on which to zoom onto. The position of the area needs to
   *               be in local space.
   * @param duration - The duration of the transition
   * @param buffer - The buffer to apply around the node and the viewport edges
   * @param timing - The timing function to use for the transition
   */
  public zoomOnto(
    area: PossibleRect,
    duration?: number,
    buffer?: number,
    timing?: TimingFunction,
  ): ThreadGenerator;

  /**
   * Zooms the view onto the provided node until it fills out the viewport.
   * Can optionally apply a buffer around the node.
   *
   * @param node - The node to zoom onto. The node needs to either be a direct or
   *               transitive child of the camera node.
   * @param duration - The duration of the transition
   * @param buffer - The buffer to apply around the node and the viewport edges
   * @param timing - The timing function to use for the transition
   */
  public zoomOnto(
    node: Node,
    duration?: number,
    buffer?: number,
    timing?: TimingFunction,
  ): ThreadGenerator;

  public *zoomOnto(
    area: PossibleRect | Node,
    duration = 1,
    buffer = 0,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    if (area instanceof Node) {
      area = new Rect(area.absolutePosition(), area.cacheRect().size);
    }

    const rect = new Rect(area);
    const scale = this.size().div(this.fitRectAroundArea(rect, buffer));

    yield* all(
      this.scale(scale, duration, timing),
      this.translation(rect.position.flipped, duration, timing),
    );
  }

  /**
   * Centers the camera view on the provided node without changing the zoom level.
   *
   * @param node - The node to center on. The node needs to either be a direct or
   *               transitive child of the camera node.
   * @param duration - The duration of the transition
   * @param timing - The timing function to use for the transition
   */
  public centerOn(
    node: Node,
    duration?: number,
    timing?: TimingFunction,
  ): ThreadGenerator;

  /**
   * Centers the camera view on the provided area without changing the zoom level.
   *
   * @param area - The area to center on. The position of the area should be in local space.
   * @param duration - The duration of the transition
   * @param timing - The timing function to use for the transition
   */
  public centerOn(
    area: PossibleRect,
    duration?: number,
    timing?: TimingFunction,
  ): ThreadGenerator;
  public *centerOn(
    area: Vector2 | PossibleRect | Node,
    duration = 1,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    if (area instanceof Node) {
      area = new Rect(area.absolutePosition(), area.cacheRect().size);
    }

    yield* this.translation(new Rect(area).position.flipped, duration, timing);
  }

  protected override draw(context: CanvasRenderingContext2D): void {
    super.draw(context);
    this.scene()?.render(context);
  }

  public override hit(position: Vector2): Node | null {
    return this.scene()?.hit(position) ?? super.hit(position);
  }

  private fitRectAroundArea(area: Rect, buffer: number): Vector2 {
    const aspectRatio = this.size().height / this.size().width;
    const areaAspectRatio = area.height / area.width;

    let size: Vector2;

    if (areaAspectRatio === aspectRatio) {
      size = area.size;
    } else if (areaAspectRatio > aspectRatio) {
      size = new Vector2(area.height / aspectRatio, area.height);
    } else {
      size = new Vector2(area.width, area.width * aspectRatio);
    }

    const xScaleFactor = (size.x + buffer) / size.x;
    const yScaleFactor = (size.y + buffer) / size.y;
    const scaleFactor = Math.max(xScaleFactor, yScaleFactor);

    return size.scale(scaleFactor);
  }
}
