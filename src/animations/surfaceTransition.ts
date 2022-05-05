import {Surface} from '../components';
import {
  calculateRatio,
  clampRemap,
  colorTween,
  easeInOutCubic,
  easeInOutQuint,
  rectArcTween,
  tween,
} from '../tweening';
import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';

export interface SurfaceTransitionConfig {
  reverse?: boolean;
  onSurfaceChange?: (surface: Surface) => void;
  onFromOpacityChange?: (
    surface: Surface,
    value: number,
    relativeValue: number,
  ) => boolean | void;
  onToOpacityChange?: (
    surface: Surface,
    value: number,
    relativeValue: number,
  ) => boolean | void;
  transitionTime?: number;
}

decorate(surfaceTransition, threadable());
export function surfaceTransition(fromSurfaceOriginal: Surface, clone = true) {
  const fromSurface = clone
    ? fromSurfaceOriginal
        .clone()
        .moveTo(fromSurfaceOriginal.parent)
        .zIndex(fromSurfaceOriginal.zIndex())
    : fromSurfaceOriginal;

  if (clone) {
    fromSurfaceOriginal.hide();
  }
  const from = fromSurfaceOriginal.getMask();

  decorate(surfaceTransitionRunner, threadable());
  function* surfaceTransitionRunner(
    target: Surface,
    config: SurfaceTransitionConfig = {},
  ): ThreadGenerator {
    const transitionTime = config.transitionTime ?? 1 / 3;
    const to = target.getMask();
    const toPos = target.getPosition();
    const fromPos = fromSurface.getPosition();

    let relativeValue = 0;
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

    const ratio =
      (calculateRatio(fromNewPos, toPos) + calculateRatio(from, to)) / 2;

    target.hide();

    config.onSurfaceChange?.(fromSurface);

    let check = true;
    yield* tween(0.6, value => {
      if (value > transitionTime) {
        relativeValue = clampRemap(transitionTime, 1, 0, 1, value);
        if (check) {
          target.show();
          fromSurface.destroy();
        }

        target.setMask({
          ...from,
          ...rectArcTween(
            from,
            to,
            easeInOutQuint(value),
            config.reverse,
            ratio,
          ),
          radius: easeInOutCubic(value, from.radius, target.radius()),
          color: colorTween(
            from.color,
            target.background(),
            easeInOutQuint(value),
          ),
        });
        target.setPosition(
          rectArcTween(
            fromNewPos,
            toPos,
            easeInOutQuint(value),
            config.reverse,
            ratio,
          ),
        );
        if (!config.onToOpacityChange?.(target, value, relativeValue)) {
          target.getChild().opacity(relativeValue);
        }

        if (check) {
          config.onSurfaceChange?.(target);
          check = false;
        }
      } else {
        relativeValue = clampRemap(0, transitionTime, 1, 0, value);
        fromSurface.setMask({
          ...from,
          ...rectArcTween(
            from,
            to,
            easeInOutQuint(value),
            config.reverse,
            ratio,
          ),
          radius: easeInOutCubic(value, from.radius, target.radius()),
          color: colorTween(
            from.color,
            target.background(),
            easeInOutQuint(value),
          ),
        });
        fromSurface.setPosition(
          rectArcTween(
            fromPos,
            toNewPos,
            easeInOutQuint(value),
            config.reverse,
            ratio,
          ),
        );

        if (!config.onFromOpacityChange?.(target, value, relativeValue)) {
          fromSurface.getChild().opacity(relativeValue);
        }
      }
    });

    target.setMask(null);
    target.show();
  }

  return surfaceTransitionRunner;
}
