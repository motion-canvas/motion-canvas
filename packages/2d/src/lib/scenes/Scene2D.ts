import {
  FullSceneDescription,
  GeneratorScene,
  Inspectable,
  InspectedAttributes,
  InspectedElement,
  Scene,
  SceneRenderEvent,
  ThreadGeneratorFactory,
  Vector2,
  useLogger,
} from '@motion-canvas/core';
import {Camera, Node, View2D} from '../components';
import {is} from '../utils';

export class Scene2D extends GeneratorScene<View2D> implements Inspectable {
  private view: View2D | null = null;
  private registeredNodes = new Map<string, Node>();
  private readonly nodeCounters = new Map<string, number>();
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
    this.getView()
      ?.playbackState(this.playback.state)
      .globalTime(this.playback.time);
    return super.next();
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();
    this.renderLifecycle.dispatch([SceneRenderEvent.BeforeRender, context]);
    context.save();
    this.renderLifecycle.dispatch([SceneRenderEvent.BeginRender, context]);
    this.getView()
      .playbackState(this.playback.state)
      .globalTime(this.playback.time);
    this.getView().render(context);
    this.renderLifecycle.dispatch([SceneRenderEvent.FinishRender, context]);
    context.restore();
    this.renderLifecycle.dispatch([SceneRenderEvent.AfterRender, context]);
    context.restore();
  }

  public override reset(previousScene?: Scene): Promise<void> {
    for (const key of this.registeredNodes.keys()) {
      try {
        this.registeredNodes.get(key)!.dispose();
      } catch (e: any) {
        this.logger.error(e);
      }
    }
    this.registeredNodes.clear();
    this.registeredNodes = new Map<string, Node>();
    this.nodeCounters.clear();
    this.recreateView();

    return super.reset(previousScene);
  }

  public inspectPosition(x: number, y: number): InspectedElement | null {
    return this.execute(
      () => this.getView().hit(new Vector2(x, y))?.key ?? null,
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
        const cameras = this.getView().findAll(is(Camera));
        const parentCameras = [];
        for (const camera of cameras) {
          const scene = camera.scene();
          if (!scene) continue;

          if (scene === node || scene.findFirst(n => n === node)) {
            parentCameras.push(camera);
          }
        }

        if (parentCameras.length > 0) {
          for (const camera of parentCameras) {
            const cameraParentToWorld = camera.parentToWorld();
            const cameraLocalToParent = camera.localToParent().inverse();
            const nodeLocalToWorld = node.localToWorld();

            node.drawOverlay(
              context,
              matrix
                .multiply(cameraParentToWorld)
                .multiply(cameraLocalToParent)
                .multiply(nodeLocalToWorld),
            );
          }
        } else {
          node.drawOverlay(context, matrix.multiply(node.localToWorld()));
        }
      });
    }
  }

  public transformMousePosition(x: number, y: number): Vector2 | null {
    return new Vector2(x, y).transformAsPoint(
      this.getView().localToParent().inverse(),
    );
  }

  public registerNode(node: Node, key?: string): [string, () => void] {
    const className = node.constructor?.name ?? 'unknown';
    const counter = (this.nodeCounters.get(className) ?? 0) + 1;
    this.nodeCounters.set(className, counter);

    if (key && this.registeredNodes.has(key)) {
      useLogger().error({
        message: `Duplicated node key: "${key}".`,
        inspect: key,
        stack: new Error().stack,
      });
      key = undefined;
    }

    key ??= `${this.name}/${className}[${counter}]`;
    this.registeredNodes.set(key, node);
    const currentNodeMap = this.registeredNodes;
    return [key, () => currentNodeMap.delete(key!)];
  }

  public getNode(key: any): Node | null {
    if (typeof key !== 'string') return null;
    return this.registeredNodes.get(key) ?? null;
  }

  public *getDetachedNodes() {
    for (const node of this.registeredNodes.values()) {
      if (!node.parent() && node !== this.view) yield node;
    }
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
