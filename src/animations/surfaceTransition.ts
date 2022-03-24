import {Surface} from '../components/Surface';
import {TimeTween} from './TimeTween';
import {tween} from "./tween";
import {decorate, threadable} from "../decorators";

export interface SurfaceTransitionConfig {
  reverse?: boolean;
  onSurfaceChange?: (surface: Surface) => void;
  onFromOpacityChange?: (surface: Surface, value: TimeTween) => boolean | void;
  onToOpacityChange?: (surface: Surface, value: TimeTween) => boolean | void;
}

decorate(surfaceTransition, threadable());
export function surfaceTransition(fromSurfaceOriginal: Surface) {
  const fromSurface = fromSurfaceOriginal
    .clone()
    .moveTo(fromSurfaceOriginal.parent)
    .zIndex(fromSurfaceOriginal.zIndex());

  fromSurfaceOriginal.hide();
  const from = fromSurfaceOriginal.getMask();

  return function* (target: Surface, config: SurfaceTransitionConfig = {}) {
    const to = target.getMask();
    const toPos = target.getPosition();
    const fromPos = fromSurface.getPosition();

    const fromDelta = fromSurface.getOriginDelta(target.getOrigin());
    const fromNewPos = {
      x: fromPos.x + fromDelta.x,
      y: fromPos.y + fromDelta.y,
    };
    const toDelta = target.getOriginDelta(fromSurfaceOriginal.getOrigin());
    const toNewPos = {
      x: toPos.x + toDelta.x,
      y: toPos.y + toDelta.y,
    };

    target.hide();

    config.onSurfaceChange?.(fromSurface);

    let check = true;
    yield* tween(0.6, value => {
      if (value.value > 1 / 3) {
        if (check) {
          target.show();
          fromSurface.destroy();
        }

        target.setMask({
          ...from,
          ...value.rectArc(from, to, config.reverse),
          radius: value.easeInOutCubic(from.radius, to.radius),
          color: value.color(from.color, target.getChild().getColor(), value.easeInOutQuint()),
        });
        target.setPosition(value.rectArc(fromNewPos, toPos, config.reverse));
        if (!config.onToOpacityChange?.(target, value)) {
          target
            .getChild()
            .opacity(Math.max(TimeTween.map(0, 1, value.linear(-1 / 2, 1)), 0));
        }

        if (check) {
          config.onSurfaceChange?.(target);
          check = false;
        }
      } else {
        fromSurface.setMask({
          ...from,
          ...value.rectArc(from, to, config.reverse),
          radius: value.easeInOutCubic(from.radius, to.radius),
          color: value.color(from.color, target.getChild().getColor(), value.easeInOutQuint()),
        });
        fromSurface.setPosition(
          value.rectArc(fromPos, toNewPos, config.reverse),
        );

        if (!config.onFromOpacityChange?.(target, value)) {
          fromSurface
            .getChild()
            .opacity(TimeTween.map(1, 0, value.linear(0, 3)));
        }
      }
    });

    target.setMask(null);
    target.show();
  };
}
