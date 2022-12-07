import {
  GeneratorScene,
  Inspectable,
  InspectedAttributes,
  InspectedElement,
  Scene,
  SceneMetadata,
  SceneRenderEvent,
  ThreadGeneratorFactory,
} from '@motion-canvas/core/lib/scenes';
import {endScene, startScene, useScene} from '@motion-canvas/core/lib/utils';
import {Vector2} from '@motion-canvas/core/lib/types';
import {Node, View2D} from '../components';
import {Meta} from '@motion-canvas/core';

export function useScene2D(): Scene2D | null {
  const scene = useScene();
  if (scene instanceof Scene2D) {
    return scene;
  }
  return null;
}

export class Scene2D extends GeneratorScene<View2D> implements Inspectable {
  private readonly view: View2D;
  private registeredNodes: Record<string, Node> = {};
  private nodeCounters: Record<string, number> = {};

  public constructor(
    name: string,
    meta: Meta<SceneMetadata>,
    runnerFactory: ThreadGeneratorFactory<View2D>,
  ) {
    super(name, meta, runnerFactory);
    startScene(this);
    this.view = new View2D();
    endScene(this);
  }

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
    for (const key in this.registeredNodes) {
      this.registeredNodes[key].dispose();
    }
    this.registeredNodes = {};
    this.nodeCounters = {};
    this.registerNode(this.view, this.view.key);
    return super.reset(previousScene);
  }

  public inspectPosition(x: number, y: number): InspectedElement | null {
    return this.view.hit(new Vector2(x, y))?.key ?? null;
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
      node.drawOverlay(context, matrix.multiply(node.localToWorld()));
    }
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
}
