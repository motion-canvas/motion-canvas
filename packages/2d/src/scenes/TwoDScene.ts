import {
  GeneratorScene,
  Scene,
  SceneRenderEvent,
} from '@motion-canvas/core/lib/scenes';
import {TwoDView} from './TwoDView';
import {useScene} from '@motion-canvas/core/lib/utils';

export function use2DView(): TwoDView | null {
  const scene = useScene();
  if (scene instanceof TwoDScene) {
    return scene.getView();
  }
  return null;
}

export class TwoDScene extends GeneratorScene<TwoDView> {
  private readonly view = new TwoDView();

  public getView(): TwoDView {
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
