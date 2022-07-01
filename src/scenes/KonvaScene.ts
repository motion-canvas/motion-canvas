import {Container} from 'konva/lib/Container';
import {Scene, SceneDescription} from './Scene';
import {HitCanvas, SceneCanvas} from 'konva/lib/Canvas';
import {Shape, shapes} from 'konva/lib/Shape';
import {Group} from 'konva/lib/Group';
import {GeneratorScene, ThreadGeneratorFactory} from './GeneratorScene';
import {useScene} from '../utils';
import {SceneTransition, TransitionContext} from './Transitionable';
import {
  Inspectable,
  InspectedElement,
  InspectedAttributes,
  InspectedSize,
} from './Inspectable';
import {Util} from 'konva/lib/Util';
import {Node} from 'konva/lib/Node';
import {Konva} from 'konva/lib/Global';
import {NODE_ID} from '../symbols';
import {ThreadGenerator} from '../threading';

Konva.autoDrawEnabled = false;

const sceneCanvasMap = new Map<HTMLCanvasElement, SceneCanvas>();

export function useKonvaView(): KonvaView {
  const scene = useScene();
  if (scene instanceof KonvaScene) {
    return scene.view;
  }
  return null;
}

/**
 * Create a descriptor for a Konva scene.
 *
 * @example
 * ```ts
 * // example.scene.ts
 *
 * export default makeKonvaScene(function* example(view) {
 *   yield* view.transition();
 *   // perform animation
 * });
 * ```
 *
 * @param factory
 */
export function makeKonvaScene(
  factory: ThreadGeneratorFactory<KonvaView>,
): SceneDescription {
  return {
    name: factory.name,
    config: factory,
    klass: KonvaScene,
  };
}

class KonvaView extends Container implements TransitionContext {
  public constructor(private readonly scene: KonvaScene) {
    super();
  }

  /**
   * Start transitioning out of the current scene.
   */
  public canFinish() {
    this.scene.enterCanTransitionOut();
  }

  /**
   * @inheritDoc Transitionable.transition
   */
  public transition(transitionRunner?: SceneTransition): ThreadGenerator {
    return this.scene.transition(transitionRunner);
  }

  public updateLayout() {
    super.updateLayout();
    let limit = 10;
    while (this.wasDirty() && limit > 0) {
      super.updateLayout();
      limit--;
    }

    if (limit === 0) {
      console.warn('Layout iteration limit exceeded');
    }
  }

  public add(...children: (Shape | Group)[]): this {
    super.add(...children.flat());
    this.updateLayout();
    return this;
  }

  public _validateAdd() {
    // do nothing
  }
}

export class KonvaScene
  extends GeneratorScene<KonvaView>
  implements Inspectable
{
  public readonly view = new KonvaView(this);
  private hitCanvas = new HitCanvas({pixelRatio: 1});

  public getView(): KonvaView {
    return this.view;
  }

  public update() {
    this.view.updateLayout();
  }

  public render(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    let sceneCanvas = sceneCanvasMap.get(canvas);
    if (!sceneCanvas) {
      sceneCanvas = new SceneCanvas({
        width: canvas.width,
        height: canvas.height,
        pixelRatio: 1,
      });
      sceneCanvas._canvas = canvas;
      sceneCanvas.getContext()._context = context;
    }

    this.view.drawScene(sceneCanvas);
  }

  public reset(previousScene: Scene = null) {
    this.view.x(0).y(0).opacity(1).show();
    this.view.destroyChildren();
    return super.reset(previousScene);
  }

  public getTransitionContext(): TransitionContext {
    return this.view;
  }

  //#region Inspectable Interface

  public inspectPosition(x: number, y: number): InspectedElement | null {
    this.hitCanvas.setSize(this.getSize().width, this.getSize().height);
    this.project.transformCanvas(this.hitCanvas.context._context);
    this.view.drawHit(this.hitCanvas, this.view);

    const color = this.hitCanvas.context.getImageData(x, y, 1, 1).data;
    if (color[3] < 255) return null;
    const key = Util._rgbToHex(color[0], color[1], color[2]);
    return shapes[`#${key}`] ?? null;
  }

  public validateInspection(
    element: InspectedElement | null,
  ): InspectedElement | null {
    if (!(element instanceof Node)) return null;
    if (element.isAncestorOf(this.view)) return element;
    const id = element.attrs[NODE_ID];
    return (
      this.view.findOne((node: Node) => node.attrs[NODE_ID] === id) ?? null
    );
  }

  public inspectAttributes(
    element: InspectedElement,
  ): InspectedAttributes | null {
    if (!(element instanceof Node)) return null;
    return element.attrs;
  }

  public inspectBoundingBox(element: InspectedElement): InspectedSize {
    if (!(element instanceof Node)) return {};

    const rect = element.getClientRect({relativeTo: this.view});
    const scale = element.getAbsoluteScale(this.view);
    const position = element.getAbsolutePosition(this.view);
    const offset = element.getOriginOffset();

    return {
      rect,
      contentRect: element.getPadd().scale(scale).shrink(rect),
      marginRect: element.getMargin().scale(scale).expand(rect),
      position: {
        x: position.x + offset.x,
        y: position.y + offset.y,
      },
    };
  }

  //#endregion
}
