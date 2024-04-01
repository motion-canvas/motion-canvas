import {
  all,
  DEFAULT,
  easeInOutCubic,
  InterpolationFunction,
  modify,
  PossibleVector2,
  Reference,
  SignalValue,
  SimpleSignal,
  threadable,
  ThreadGenerator,
  TimingFunction,
  tween,
  unwrap,
  Vector2,
} from '@motion-canvas/core';
import {cloneable, signal} from '../decorators';
import {Curve} from './Curve';
import {Node, NodeProps} from './Node';
import {Rect, RectProps} from './Rect';

export interface CameraProps extends NodeProps {
  /**
   * {@inheritDoc Camera.scene}
   */
  scene?: Node;

  /**
   * {@inheritDoc Camera.zoom}
   */
  zoom?: SignalValue<number>;
}

/**
 * A node representing an orthographic camera.
 *
 * @preview
 * ```tsx editor
 * import {all} from '@motion-canvas/core';
 * import {Camera, Rect, Circle} from '@motion-canvas/2d';
 *
 * export default makeScene2D(function* (view) {
 *   const camera = createRef<Camera>();
 *   const rect = createRef<Rect>();
 *   const circle = createRef<Circle>();
 *
 *   view.add(
 *     <Camera ref={camera}>
 *       <Rect
 *         ref={rect}
 *         fill={'lightseagreen'}
 *         size={200}
 *         position={[300, -200]}
 *       />
 *       <Circle
 *         ref={circle}
 *         fill={'hotpink'}
 *         size={180}
 *         position={[-300, 200]}
 *       />
 *     </Camera>
 *   );
 *
 *   yield* camera().centerOn(rect(), 2);
 *   yield* all(
 *     camera().centerOn(circle(), 2),
 *     camera().zoom(2, 2),
 *   );
 * });
 * ```
 */
export class Camera extends Node {
  /**
   * The scene node that the camera is rendering.
   */
  @signal()
  public declare readonly scene: SimpleSignal<Node, this>;

  public constructor({children, ...props}: CameraProps) {
    super(props);

    if (!this.scene()) {
      this.scene(new Node({}));
    }

    if (children) {
      this.scene().add(children);
    }
  }

  /**
   * The zoom level of the camera.
   *
   * @defaultValue 1
   */
  @cloneable(false)
  @signal()
  public declare readonly zoom: SimpleSignal<number, this>;

  protected getZoom(): number {
    return 1 / this.scale.x();
  }

  protected setZoom(value: SignalValue<number>) {
    this.scale(modify(value, unwrapped => 1 / unwrapped));
  }

  protected getDefaultZoom() {
    return this.scale.x.context.getInitial();
  }

  protected *tweenZoom(
    value: SignalValue<number>,
    duration: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<number>,
  ): ThreadGenerator {
    const from = this.scale.x();
    yield* tween(duration, v => {
      this.zoom(
        1 / interpolationFunction(from, 1 / unwrap(value), timingFunction(v)),
      );
    });
  }

  /**
   * Resets the camera's position, rotation and zoom level to their original
   * values.
   *
   * @param duration - The duration of the tween.
   * @param timingFunction - The timing function to use for the tween.
   */
  @threadable()
  public *reset(
    duration: number,
    timingFunction: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    yield* all(
      this.position(DEFAULT, duration, timingFunction),
      this.zoom(DEFAULT, duration, timingFunction),
      this.rotation(DEFAULT, duration, timingFunction),
    );
  }

  /**
   * Centers the camera on the specified position without changing the zoom
   * level.
   *
   * @param position - The position to center the camera on.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  public centerOn(
    position: PossibleVector2,
    duration: number,
    timing?: TimingFunction,
  ): ThreadGenerator;
  /**
   * Centers the camera on the specified node without changing the zoom level.
   *
   * @param node - The node to center the camera on.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  public centerOn(
    node: Node,
    duration: number,
    timing?: TimingFunction,
  ): ThreadGenerator;
  @threadable()
  public *centerOn(
    positionOrNode: Node | PossibleVector2,
    duration: number,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    const position =
      positionOrNode instanceof Node
        ? positionOrNode
            .absolutePosition()
            .transformAsPoint(this.scene().worldToLocal())
        : positionOrNode;
    yield* this.position(position, duration, timing);
  }

  /**
   * Makes the camera follow a path specified by the provided curve.
   *
   * @remarks
   * This will not change the orientation of the camera.
   * If you want to follow the curve in reverse, use {@link followCurveReverse}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  @threadable()
  public *followCurve(
    curve: Curve,
    duration: number,
    timing: TimingFunction = easeInOutCubic,
  ): ThreadGenerator {
    yield* tween(duration, value => {
      const t = timing(value);
      const point = curve
        .getPointAtPercentage(t)
        .position.transformAsPoint(curve.localToWorld());

      this.position(point);
    });
  }

  /**
   * Makes the camera follow a path specified by the provided curve in reverse.
   *
   * @remarks
   * This will not change the orientation of the camera.
   * If you want to follow the curve in forward, use {@link followCurve}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  @threadable()
  public *followCurveReverse(
    curve: Curve,
    duration: number,
    timing: TimingFunction = easeInOutCubic,
  ) {
    yield* tween(duration, value => {
      const t = 1 - timing(value);
      const point = curve
        .getPointAtPercentage(t)
        .position.transformAsPoint(curve.localToWorld());

      this.position(point);
    });
  }

  protected override transformContext(context: CanvasRenderingContext2D) {
    const matrix = this.localToParent().inverse();
    context.transform(
      matrix.a,
      matrix.b,
      matrix.c,
      matrix.d,
      matrix.e,
      matrix.f,
    );
  }

  public override hit(position: Vector2): Node | null {
    const local = position.transformAsPoint(this.localToParent());
    return this.scene().hit(local);
  }

  protected override drawChildren(context: CanvasRenderingContext2D) {
    (this.scene() as Camera).drawChildren(context);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static Stage({
    children,
    cameraRef,
    scene,
    ...props
  }: RectProps & {cameraRef?: Reference<Camera>; scene?: Node}) {
    const camera = new Camera({scene: scene, children});

    cameraRef?.(camera);

    return new Rect({
      clip: true,
      ...props,
      children: [camera],
    });
  }
}
