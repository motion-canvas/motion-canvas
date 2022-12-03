import {
  GeneratorScene,
  Inspectable,
  InspectedAttributes,
  InspectedElement,
  Scene,
  SceneRenderEvent,
} from '@motion-canvas/core/lib/scenes';
import {View2D} from './View2D';
import {useScene} from '@motion-canvas/core/lib/utils';
import {Vector2} from '@motion-canvas/core/lib/types';
import {Node} from '../components';

export function use2DView(): View2D | null {
  const scene = useScene();
  if (scene instanceof Scene2D) {
    return scene.getView();
  }
  return null;
}

export class Scene2D extends GeneratorScene<View2D> implements Inspectable {
  private readonly view = new View2D(this.name);

  public getView(): View2D {
    return this.view;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();
    this.renderLifecycle.dispatch([SceneRenderEvent.BeforeRender, context]);
    context.save();
    this.renderLifecycle.dispatch([SceneRenderEvent.BeginRender, context]);
    this.view.render(context);
    this.renderLifecycle.dispatch([SceneRenderEvent.FinishRender, context]);
    context.restore();
    this.renderLifecycle.dispatch([SceneRenderEvent.AfterRender, context]);
    context.restore();
  }

  public override reset(previousScene?: Scene): Promise<void> {
    this.view.reset();
    return super.reset(previousScene);
  }

  public inspectPosition(x: number, y: number): InspectedElement | null {
    return this.view.hit(new Vector2(x, y))?.key ?? null;
  }

  public validateInspection(
    element: InspectedElement | null,
  ): InspectedElement | null {
    return this.elementToNode(element)?.key ?? null;
  }

  public inspectAttributes(
    element: InspectedElement,
  ): InspectedAttributes | null {
    const node = this.elementToNode(element);
    if (!node) return null;

    const attributes: Record<string, any> = {
      key: node.key,
    };
    for (const {key, meta, signal} of node) {
      if (!meta.inspectable) continue;
      attributes[key] = signal();
    }

    return attributes;
  }

  public drawOverlay(
    element: InspectedElement,
    matrix: DOMMatrix,
    context: CanvasRenderingContext2D,
  ): void {
    const node = this.elementToNode(element);
    if (node) {
      node.drawOverlay(context, matrix.multiply(node.localToWorld()));
    }
  }

  protected elementToNode(element: InspectedElement): Node | null {
    if (typeof element !== 'string') return null;
    return this.view.getNode(element);
  }
}
