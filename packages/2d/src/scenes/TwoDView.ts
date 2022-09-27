import {Node} from '../components';

export class TwoDView extends Node {
  private static frameID = 'motion-canvas-2d-frame';

  public constructor() {
    // TODO Sync with the project size
    super({width: 1920, height: 1080, composite: true});

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

    if (frame.contentDocument) {
      frame.contentDocument.body.append(this.layout.element);
    }
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

  protected transformContext(context: CanvasRenderingContext2D) {
    // do nothing
  }
}
