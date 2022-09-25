import {Node} from '../components';

export class TwoDView extends Node {
  private static frameID = 'motion-canvas-2d-frame';

  public constructor() {
    // TODO Sync with the project size
    super({width: 1920, height: 1080});

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
    this.computedSize();
    this.computedPosition();
    super.render(context);
  }
}
