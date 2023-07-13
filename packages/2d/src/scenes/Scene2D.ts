import {
  FullSceneDescription,
  GeneratorScene,
  Inspectable,
  InspectedAttributes,
  InspectedElement,
  Scene,
  SceneRenderEvent,
  ThreadGeneratorFactory,
} from '@motion-canvas/core/lib/scenes';
import {Vector2} from '@motion-canvas/core';
import {Node, View2D} from '../components';

export class Scene2D extends GeneratorScene<View2D> implements Inspectable {
  private view: View2D | null = null;
  private registeredNodes: Record<string, Node> = {};
  private nodeCounters: Record<string, number> = {};
  private assetHash = Date.now().toString();

  public constructor(
    description: FullSceneDescription<ThreadGeneratorFactory<View2D>>,
  ) {
    super(description);
    this.recreateView();
    if (import.meta.hot) {
      import.meta.hot.on('motion-canvas:assets', () => {
        this.assetHash = Date.now().toString();
        this.getView().assetHash(this.assetHash);
      });
    }
  }

  public getView(): View2D {
    return this.view!;
  }

  public override next(): Promise<void> {
    this.getView()?.playbackState(this.playback.state);
    return super.next();
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();
    this.renderLifecycle.dispatch([SceneRenderEvent.BeforeRender, context]);
    context.save();
    this.renderLifecycle.dispatch([SceneRenderEvent.BeginRender, context]);
    this.getView().playbackState(this.playback.state);
    this.getView().render(context);
    this.renderLifecycle.dispatch([SceneRenderEvent.FinishRender, context]);
    context.restore();
    this.renderLifecycle.dispatch([SceneRenderEvent.AfterRender, context]);
    context.restore();
  }

  public override reset(previousScene?: Scene): Promise<void> {
    for (const key in this.registeredNodes) {
      try {
        this.registeredNodes[key].dispose();
      } catch (e: any) {
        this.logger.error(e);
      }
    }
    this.registeredNodes = {};
    this.nodeCounters = {};
    this.recreateView();

    return super.reset(previousScene);
  }

  public inspectPosition(x: number, y: number): InspectedElement | null {
    return this.execute(
      () =>
        this.getView().hit(new Vector2(x, y).scale(this.resolutionScale))
          ?.key ?? null,
    );
  }

  public validateInspection(
    element: InspectedElement | null,
  ): InspectedElement | null {
    return this.getNode(element)?.key ?? null;
  }

  public inspectAttributes(
    element: InspectedElement,
  ): InspectedAttributes | null {
    const node = this.getNode(element);
    if (!node) return null;

    const attributes: Record<string, any> = {
      stack: node.creationStack,
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
    const node = this.getNode(element);
    if (node) {
      this.execute(() => {
        node.drawOverlay(
          context,
          matrix
            .scale(1 / this.resolutionScale, 1 / this.resolutionScale)
            .multiplySelf(node.localToWorld()),
        );
      });
    }
  }

  public transformMousePosition(x: number, y: number): Vector2 | null {
    return new Vector2(x, y)
      .scale(this.resolutionScale)
      .transformAsPoint(this.getView().localToParent().inverse());
  }

  public registerNode(node: Node, key?: string): string {
    const className = node.constructor?.name ?? 'unknown';
    this.nodeCounters[className] ??= 0;
    const counter = this.nodeCounters[className]++;

    key ??= `${this.name}/${className}[${counter}]`;
    this.registeredNodes[key] = node;
    return key;
  }

  public getNode(key: any): Node | null {
    if (typeof key !== 'string') return null;
    return this.registeredNodes[key] ?? null;
  }

  protected recreateView() {
    this.execute(() => {
      const size = this.getSize();
      this.view = new View2D({
        position: size.scale(this.resolutionScale / 2),
        scale: this.resolutionScale,
        assetHash: this.assetHash,
        size,
      });
    });
  }
}
