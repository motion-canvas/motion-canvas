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

export interface SurfaceFromConfig {
  reverse?: boolean;
  onOpacityChange?: (
    surface: Surface,
    value: number,
    relativeValue: number,
  ) => boolean | void;
  transitionTime?: number;
}

decorate(surfaceFrom, threadable());
export function surfaceFrom(fromSurface: Surface) {
  const from = fromSurface.getMask();

  decorate(surfaceTransitionExecutor, threadable());
  function* surfaceTransitionExecutor(
    target: Surface,
    config: SurfaceFromConfig = {},
  ): ThreadGenerator {
    const transitionTime = config.transitionTime ?? 1 / 3;
    const to = target.getMask();
    const toPos = target.getPosition();
    const fromDelta = fromSurface.getOriginDelta(target.getOrigin());
    target.show();

    const ratio =
      (calculateRatio(fromSurface.getPosition(), toPos) +
        calculateRatio(from, to)) /
      2;

    yield* tween(0.6, value => {
      const relativeValue = clampRemap(transitionTime, 1, 0, 1, value);
      const fromPos = fromSurface.getPosition();
      const fromNewPos = {
        x: fromPos.x + fromDelta.x,
        y: fromPos.y + fromDelta.y,
      };

      target.setMask({
        ...from,
        ...rectArcTween(from, to, easeInOutQuint(value), config.reverse, ratio),
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
      if (!config.onOpacityChange?.(target, value, relativeValue)) {
        target.getChild().opacity(relativeValue);
      }
    });

    target.setMask(null);
    target.show();
  }

  return surfaceTransitionExecutor;
}
