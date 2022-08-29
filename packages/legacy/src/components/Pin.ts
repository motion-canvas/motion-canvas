import {Group} from 'konva/lib/Group';
import {Container, ContainerConfig} from 'konva/lib/Container';
import {
  Center,
  flipOrigin,
  getOriginDelta,
  Origin,
} from '@motion-canvas/core/lib/types';
import {GetSet, IRect} from 'konva/lib/types';
import {KonvaNode, getset} from '../decorators';
import {Node} from 'konva/lib/Node';
import {useKonvaView} from '../scenes';

export interface PinConfig extends ContainerConfig {
  target?: Node;
  attach?: Node;
  direction?: Center;
}

@KonvaNode()
export class Pin extends Group {
  @getset(null, Node.prototype.markDirty)
  public target: GetSet<PinConfig['target'], this>;
  @getset(null, Node.prototype.markDirty)
  public attach: GetSet<PinConfig['attach'], this>;
  @getset(null, Pin.prototype.markDirty)
  public direction: GetSet<PinConfig['direction'], this>;

  public constructor(config?: PinConfig) {
    super(config);
  }

  public getDirection(): Center {
    return (
      this.attrs.direction ??
      (this.attach() ? Center.Vertical : Center.Horizontal)
    );
  }

  public isDirty(): boolean {
    return super.isDirty() || this.target()?.wasDirty();
  }

  public recalculateLayout() {
    const attach = this.attach();
    if (attach) {
      const attachDirection = flipOrigin(attach.getOrigin(), this.direction());
      const rect = this.getClientRect({
        relativeTo: useKonvaView(),
      });
      const offset = getOriginDelta(rect, Origin.TopLeft, attachDirection);
      attach.position({
        x: rect.x + offset.x,
        y: rect.y + offset.y,
      });
    }
    super.recalculateLayout();
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
