import {Layout, Node} from '../components';

export class View2D extends Layout {
  public static frameID = 'motion-canvas-2d-frame';
  public static shadowRoot: ShadowRoot;

  static {
    let frame = document.querySelector<HTMLDivElement>(`#${View2D.frameID}`);
    if (!frame) {
      frame = document.createElement('div');
      frame.id = View2D.frameID;
      frame.style.position = 'absolute';
      frame.style.pointerEvents = 'none';
      frame.style.top = '0';
      frame.style.left = '0';
      frame.style.opacity = '0';
      document.body.prepend(frame);
    }
    View2D.shadowRoot = frame.shadowRoot ?? frame.attachShadow({mode: 'open'});
  }

  private registeredNodes: Record<string, Node> = {};
  private nodeCounters: Record<string, number> = {};

  public constructor(private readonly name: string) {
    super({
      key: `${name}/View2D`,
      // TODO Sync with the project size
      width: 1920,
      height: 1080,
      composite: true,
      fontFamily: 'Roboto',
      fontSize: 48,
      lineHeight: 64,
      textWrap: false,
      fontStyle: 'normal',
    });

    View2D.shadowRoot.append(this.element);
    this.applyFlex();
  }

  public reset() {
    this.removeChildren();
    for (const key in this.registeredNodes) {
      this.registeredNodes[key].dispose();
    }
    this.registeredNodes = {};
    this.nodeCounters = {};
    this.element.innerText = '';
  }

  public override render(context: CanvasRenderingContext2D) {
    const currentMatrix = this.localToParent();
    const customMatrix = context.getTransform();
    if (
      customMatrix.a !== currentMatrix.a ||
      customMatrix.b !== currentMatrix.b ||
      customMatrix.c !== currentMatrix.c ||
      customMatrix.d !== currentMatrix.d ||
      customMatrix.e !== currentMatrix.e ||
      customMatrix.f !== currentMatrix.f
    ) {
      this.position
        .x(customMatrix.m41)
        .position.y(customMatrix.m42)
        .scale.x(
          Math.sqrt(
            customMatrix.m11 * customMatrix.m11 +
              customMatrix.m12 * customMatrix.m12,
          ),
        )
        .scale.y(
          Math.sqrt(
            customMatrix.m21 * customMatrix.m21 +
              customMatrix.m22 * customMatrix.m22,
          ),
        )
        .rotation(Math.atan2(customMatrix.m12, customMatrix.m11));
    }

    this.computedSize();
    this.computedPosition();
    super.render(context);
  }

  protected override transformContext() {
    // do nothing
  }

  protected override requestLayoutUpdate() {
    this.updateLayout();
  }

  public override view(): View2D | null {
    return this;
  }

  public registerNode(node: Node, key?: string): string {
    const className = node.constructor?.name ?? 'unknown';
    this.nodeCounters[className] ??= 0;

    key ??= `${this.name}/${className}[${this.nodeCounters[className]++}]`;
    this.registeredNodes[key] = node;
    return key;
  }

  public getNode(key: string): Node | null {
    if (this.key === key) return this;
    return this.registeredNodes[key] ?? null;
  }
}
