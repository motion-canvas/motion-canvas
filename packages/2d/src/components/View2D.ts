import {Layout} from './Layout';

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
      frame.style.overflow = 'hidden';
      document.body.prepend(frame);
    }
    View2D.shadowRoot = frame.shadowRoot ?? frame.attachShadow({mode: 'open'});
  }

  public constructor() {
    super({
      // TODO Sync with the project size
      width: 1920,
      height: 1080,
      x: 960,
      y: 540,
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

  protected override transformContext() {
    // do nothing
  }

  public override dispose() {
    this.removeChildren();
    this.element.innerText = '';
  }

  public override render(context: CanvasRenderingContext2D) {
    this.computedSize();
    this.computedPosition();
    super.render(context);
  }

  protected override requestLayoutUpdate() {
    this.updateLayout();
  }

  public override view(): View2D | null {
    return this;
  }
}
