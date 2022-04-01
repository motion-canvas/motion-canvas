import {Group} from 'konva/lib/Group';
import {Container, ContainerConfig} from 'konva/lib/Container';
import {Center, flipOrigin, Origin} from '../types';
import {GetSet, IRect} from 'konva/lib/types';
import {getset, KonvaNode} from '../decorators';
import {getOriginDelta, LAYOUT_CHANGE_EVENT, LayoutNode} from './ILayoutNode';
import {Node} from 'konva/lib/Node';
import {bind} from '../decorators/bind';

export interface PinConfig extends ContainerConfig {
  target?: Node;
  attach?: LayoutNode;
  direction?: Center;
}

export const PIN_CHANGE_EVENT = 'pinChange';

@KonvaNode()
export class Pin extends Group {
  @getset(null, Pin.prototype.firePinChangeEvent)
  public target: GetSet<PinConfig['target'], this>;
  @getset(null)
  public attach: GetSet<PinConfig['attach'], this>;
  @getset()
  public direction: GetSet<PinConfig['direction'], this>;

  public constructor(config?: PinConfig) {
    super(config);
    this.on('absoluteTransformChange', this.firePinChangeEvent);
  }

  public getDirection(): Center {
    return (
      this.attrs.direction ??
      (this.attach() ? Center.Vertical : Center.Horizontal)
    );
  }

  public destroy(): this {
    this.attrs.target?.off('absoluteTransformChange', this.firePinChangeEvent);
    this.attrs.target?.off(LAYOUT_CHANGE_EVENT, this.firePinChangeEvent);
    return super.destroy();
  }

  public setTarget(value: Node): this {
    this.attrs.target?.off('absoluteTransformChange', this.firePinChangeEvent);
    this.attrs.target?.off(LAYOUT_CHANGE_EVENT, this.firePinChangeEvent);
    this.attrs.target = value;
    this.attrs.target?.on('absoluteTransformChange', this.firePinChangeEvent);
    this.attrs.target?.on(LAYOUT_CHANGE_EVENT, this.firePinChangeEvent);
    this.firePinChangeEvent();

    return this;
  }

  @bind()
  private firePinChangeEvent() {
    const attach = this.attach();
    if (attach) {
      const attachDirection = flipOrigin(attach.getOrigin(), this.direction());
      const rect = this.getClientRect({relativeTo: attach.getLayer()});
      const offset = getOriginDelta(rect, Origin.TopLeft, attachDirection);
      attach.position({
        x: rect.x + offset.x,
        y: rect.y + offset.y,
      });
    }

    this.fire(PIN_CHANGE_EVENT, undefined, true);
  }

  public getClientRect(config?: {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Container;
  }): IRect {
    return this.target()?.getClientRect(config) ?? super.getClientRect(config);
  }
}
