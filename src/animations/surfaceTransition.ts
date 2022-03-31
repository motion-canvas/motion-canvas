import {Surface} from '../components/Surface';
import {TimeTween} from './TimeTween';
import {tween} from './tween';
import {decorate, threadable} from '../decorators';

export interface SurfaceTransitionConfig {
  reverse?: boolean;
  onSurfaceChange?: (surface: Surface) => void;
  onFromOpacityChange?: (
    surface: Surface,
    value: TimeTween,
    relativeValue: TimeTween,
  ) => boolean | void;
  onToOpacityChange?: (
    surface: Surface,
    value: TimeTween,
    relativeValue: TimeTween,
  ) => boolean | void;
  transitionTime?: number;
}

decorate(surfaceTransition, threadable());
export function surfaceTransition(fromSurfaceOriginal: Surface) {
  const fromSurface = fromSurfaceOriginal
    .clone()
    .moveTo(fromSurfaceOriginal.parent)
    .zIndex(fromSurfaceOriginal.zIndex());

  fromSurfaceOriginal.hide();
  const from = fromSurfaceOriginal.getMask();

  decorate(surfaceTransitionExecutor, threadable());
  function* surfaceTransitionExecutor(
    target: Surface,
    config: SurfaceTransitionConfig = {},
  ) {
    const transitionTime = config.transitionTime ?? 1 / 3;
    const to = target.getMask();
    const toPos = target.getPosition();
    const fromPos = fromSurface.getPosition();

    const relativeValue = new TimeTween(0);
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
      if (value.value > transitionTime) {
        relativeValue.value = TimeTween.clampRemap(
          transitionTime,
          1,
          0,
          1,
          value.value,
        );
        if (check) {
          target.show();
          fromSurface.destroy();
        }

        target.setMask({
          ...from,
          ...value.rectArc(from, to, config.reverse),
          radius: value.easeInOutCubic(from.radius, target.radius()),
          color: value.color(
            from.color,
            target.background(),
            value.easeInOutQuint(),
          ),
        });
        target.setPosition(value.rectArc(fromNewPos, toPos, config.reverse));
        if (!config.onToOpacityChange?.(target, value, relativeValue)) {
          target.getChild().opacity(relativeValue.value);
        }

        if (check) {
          config.onSurfaceChange?.(target);
          check = false;
        }
      } else {
        relativeValue.value = TimeTween.clampRemap(
          0,
          transitionTime,
          1,
          0,
          value.value,
        );
        fromSurface.setMask({
          ...from,
          ...value.rectArc(from, to, config.reverse),
          radius: value.easeInOutCubic(from.radius, target.radius()),
          color: value.color(
            from.color,
            target.background(),
            value.easeInOutQuint(),
          ),
        });
        fromSurface.setPosition(
          value.rectArc(fromPos, toNewPos, config.reverse),
        );

        if (!config.onFromOpacityChange?.(target, value, relativeValue)) {
          fromSurface.getChild().opacity(relativeValue.value);
        }
      }
    });

    target.setMask(null);
    target.show();
  }

  return surfaceTransitionExecutor;
}
