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
import {Node} from '../components';
import {Vector2} from '@motion-canvas/core/lib/types';

export function use2DView(): View2D | null {
  const scene = useScene();
  if (scene instanceof Scene2D) {
    return scene.getView();
  }
  return null;
}

export class Scene2D extends GeneratorScene<View2D> implements Inspectable {
  private readonly view = new View2D();

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
    return this.view.hit(new Vector2(x, y));
  }

  public validateInspection(
    element: InspectedElement | null,
  ): InspectedElement | null {
    if (!(element instanceof Node)) return null;
    return this.view.getNode(element.key);
  }

  public inspectAttributes(
    element: InspectedElement,
  ): InspectedAttributes | null {
    if (!(element instanceof Node)) return null;
    const attributes: Record<string, any> = {};
    for (const {key, meta, signal} of element) {
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
    if (!(element instanceof Node)) return;
    element.drawOverlay(context, matrix.multiply(element.localToWorld()));
  }
}
