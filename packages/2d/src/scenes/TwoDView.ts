import {Node} from '../components';

export class TwoDView extends Node<any> {
  private static frameID = 'motion-canvas-2d-frame';

  public constructor() {
    super({layout: {width: 1920, height: 1080}, mode: 'none'});

    let frame = document.querySelector<HTMLIFrameElement>(
      `#${TwoDView.frameID}`,
    );
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = TwoDView.frameID;
      frame.style.position = 'absolute';
      frame.style.pointerEvents = 'none';
      frame.style.left = '0';
      frame.style.right = '0';
      frame.style.opacity = '0';
      frame.style.border = 'none';

      document.body.prepend(frame);
    }

    if (frame.contentDocument) {
      frame.contentDocument.body.append(this.layout.element);
    }
  }

  public override render(context: CanvasRenderingContext2D) {
    this.clientRect();
    super.render(context);
  }
}
