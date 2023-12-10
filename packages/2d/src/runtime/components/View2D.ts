import type {Node} from './Node';
import {Rect, RectProps} from './Rect';
import {initial, signal} from '../decorators';
import {PlaybackState} from '@motion-canvas/core';
import {SimpleSignal} from '@motion-canvas/core/lib/signals';
import {lazy} from '@motion-canvas/core/lib/decorators';
import {useScene2D} from '../scenes/useScene2D';

export interface View2DProps extends RectProps {
  assetHash: string;
}

export class View2D extends Rect {
  @lazy(() => {
    const frameID = 'motion-canvas-2d-frame';
    let frame = document.querySelector<HTMLDivElement>(`#${frameID}`);
    if (!frame) {
      frame = document.createElement('div');
      frame.id = frameID;
      frame.style.position = 'absolute';
      frame.style.pointerEvents = 'none';
      frame.style.top = '0';
      frame.style.left = '0';
      frame.style.opacity = '0';
      frame.style.overflow = 'hidden';
      document.body.prepend(frame);
    }
    return frame.shadowRoot ?? frame.attachShadow({mode: 'open'});
  })
  public static shadowRoot: ShadowRoot;

  @initial(PlaybackState.Paused)
  @signal()
  public declare readonly playbackState: SimpleSignal<PlaybackState, this>;

  @signal()
  public declare readonly assetHash: SimpleSignal<string, this>;

  public constructor(props: View2DProps) {
    super({
      composite: true,
      fontFamily: 'Roboto',
      fontSize: 48,
      lineHeight: '120%',
      textWrap: false,
      fontStyle: 'normal',
      ...props,
    });
    this.view2D = this;

    View2D.shadowRoot.append(this.element);
    this.applyFlex();
  }

  protected override transformContext() {
    // do nothing
  }

  public override dispose() {
    this.removeChildren();
    super.dispose();
  }

  public override render(context: CanvasRenderingContext2D) {
    this.computedSize();
    this.computedPosition();
    super.render(context);
  }

  /**
   * Find a node by its key.
   *
   * @param key - The key of the node.
   */
  public findKey<T extends Node = Node>(key: string): T | null {
    return (useScene2D().getNode(key) as T) ?? null;
  }

  protected override requestLayoutUpdate() {
    this.updateLayout();
  }

  protected override requestFontUpdate() {
    this.applyFont();
  }

  public override view(): View2D {
    return this;
  }
}
