import {Surface} from '../components/Surface';
import {Project} from '../Project';
import {TimeTween} from './TimeTween';

export interface SurfaceTransitionConfig {
  reverse?: boolean;
  onSurfaceChange?: (surface: Surface) => void;
  onFromOpacityChange?: (surface: Surface, value: TimeTween) => boolean | void;
  onToOpacityChange?: (surface: Surface, value: TimeTween) => boolean | void;
}

export function surfaceTransition(this: Project, fromSurfaceOriginal: Surface) {
  const fromSurface = fromSurfaceOriginal
    .clone()
    .moveTo(fromSurfaceOriginal.parent)
    .zIndex(fromSurfaceOriginal.zIndex());

  fromSurfaceOriginal.hide();
  fromSurface.setOverride(true);

  const from = fromSurfaceOriginal.getSurfaceData();

  const project = this;
  return function* (
    target: Surface,
    config: SurfaceTransitionConfig = {},
  ) {
    const to = target.getSurfaceData();
    const toPos = target.getPosition();
    const fromPos = fromSurface.getPosition();

    const fromDelta = fromSurface.calculateOriginDelta(
      target.origin(),
    );
    const fromNewPos = {
      x: fromPos.x + fromDelta.x,
      y: fromPos.y + fromDelta.y,
    };
    const toDelta = target.calculateOriginDelta(
      fromSurfaceOriginal.origin(),
    );
    const toNewPos = {
      x: toPos.x + toDelta.x,
      y: toPos.y + toDelta.y,
    };

    target.hide();

    config.onSurfaceChange?.(fromSurface);

    let check = true;
    yield* project.tween(0.6, value => {
      if (value.value > 1 / 3) {
        if (check) {
          target.show();
          target.setOverride(true);
          fromSurface.destroy();
        }

        target.setSurfaceData({
          ...from,
          ...value.rectArc(from, to, config.reverse),
          radius: value.easeInOutCubic(from.radius, to.radius),
          color: value.color(from.color, to.color, value.easeInOutQuint()),
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
        fromSurface.setSurfaceData({
          ...from,
          ...value.rectArc(from, to, config.reverse),
          radius: value.easeInOutCubic(from.radius, to.radius),
          color: value.color(from.color, to.color, value.easeInOutQuint()),
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

    target.setOverride(false);
    target.show();
  };
}
