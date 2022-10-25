import {Layout} from '../components';

export class TwoDView extends Layout {
  public static frameID = 'motion-canvas-2d-frame';
  public static document: Document;

  static {
    let frame = document.querySelector<HTMLIFrameElement>(
      `#${TwoDView.frameID}`,
    );
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = TwoDView.frameID;
      frame.style.position = 'absolute';
      frame.style.pointerEvents = 'none';
      frame.style.top = '0';
      frame.style.left = '0';
      frame.style.opacity = '0';
      frame.style.border = 'none';

      document.body.prepend(frame);
    }
    this.document = frame.contentDocument ?? document;
  }

  public constructor() {
    super({
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

    TwoDView.document.body.append(this.element);
    this.applyFlex();
  }

  public reset() {
    this.removeChildren();
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
      this.x(customMatrix.m41)
        .y(customMatrix.m42)
        .scaleX(
          Math.sqrt(
            customMatrix.m11 * customMatrix.m11 +
              customMatrix.m12 * customMatrix.m12,
          ),
        )
        .scaleY(
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

  public override view(): TwoDView | null {
    return this;
  }
}
