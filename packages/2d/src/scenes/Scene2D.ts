import {
  GeneratorScene,
  Scene,
  SceneRenderEvent,
} from '@motion-canvas/core/lib/scenes';
import {View2D} from './View2D';
import {useScene} from '@motion-canvas/core/lib/utils';

export function use2DView(): View2D | null {
  const scene = useScene();
  if (scene instanceof Scene2D) {
    return scene.getView();
  }
  return null;
}

export class Scene2D extends GeneratorScene<View2D> {
  private readonly view = new View2D();

  public getView(): View2D {
    return this.view;
  }

  public render(context: CanvasRenderingContext2D): void {
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
}
