import {Surface} from '../components/Surface';
import {Project} from '../Project';
import {TimeTween} from './TimeTween';

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
    toSurfaceOriginal: Surface,
    inverse?: boolean,
    surfaceCallback?: (currentSurface: Surface) => void,
  ) {
    const to = toSurfaceOriginal.getSurfaceData();
    const toPos = toSurfaceOriginal.getPosition();
    const fromPos = fromSurface.getPosition();

    const fromDelta = fromSurface.calculateOriginDelta(
      toSurfaceOriginal.origin(),
    );
    const fromNewPos = {
      x: fromPos.x + fromDelta.x,
      y: fromPos.y + fromDelta.y,
    };
    const toDelta = toSurfaceOriginal.calculateOriginDelta(
      fromSurfaceOriginal.origin(),
    );
    const toNewPos = {
      x: toPos.x + toDelta.x,
      y: toPos.y + toDelta.y,
    };

    const toSurface = toSurfaceOriginal
      .clone()
      .moveTo(toSurfaceOriginal.parent)
      .zIndex(toSurfaceOriginal.zIndex());
    toSurfaceOriginal.hide();
    toSurface.hide();
    toSurface.setOverride(true);

    surfaceCallback?.(fromSurface);

    let check = true;
    yield* project.tween(0.6, value => {
      if (value.value > 1 / 3) {
        if (check) {
          toSurface.show();
          fromSurface.destroy();
        }

        toSurface.setSurfaceData({
          ...from,
          ...value.rectArc(from, to, inverse),
          radius: value.easeInOutCubic(from.radius, to.radius),
          color: value.color(from.color, to.color, value.easeInOutQuint()),
        });
        toSurface.setPosition(value.rectArc(fromNewPos, toPos, inverse));
        toSurface
          .getChild()
          .opacity(Math.max(TimeTween.map(0, 1, value.linear(-1 / 2, 1)), 0));

        if (check) {
          surfaceCallback?.(toSurface);
          check = false;
        }
      } else {
        fromSurface.setSurfaceData({
          ...from,
          ...value.rectArc(from, to, inverse),
          radius: value.easeInOutCubic(from.radius, to.radius),
          color: value.color(from.color, to.color, value.easeInOutQuint()),
        });
        fromSurface.setPosition(value.rectArc(fromPos, toNewPos, inverse));
        fromSurface.getChild().opacity(TimeTween.map(1, 0, value.linear(0, 3)));
      }
    });

    toSurface.destroy();
    toSurfaceOriginal.show();
    surfaceCallback?.(toSurfaceOriginal);
  };
}
