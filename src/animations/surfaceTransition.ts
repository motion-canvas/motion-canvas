import {Surface} from '../components/Surface';
import {TimeTween, tween} from '../tweening';

export function surfaceTransition(
  fromSurface: Surface,
  toSurface: Surface,
  inverse?: boolean,
) {
  const from = fromSurface.getSurfaceData();
  const fromPos = fromSurface.getPosition();
  const to = toSurface.getSurfaceData();
  const toPos = toSurface.getPosition();

  const fromDelta = fromSurface.calculateOriginDelta(toSurface.origin());
  const fromNewPos = {
    x: fromPos.x + fromDelta.x,
    y: fromPos.y + fromDelta.y,
  };

  const toDelta = toSurface.calculateOriginDelta(fromSurface.origin());
  const toNewPos = {
    x: toPos.x + toDelta.x,
    y: toPos.y + toDelta.y,
  };

  fromSurface.show();
  toSurface.hide();

  let check = true;
  return tween(0.6, value => {
    const distance = value.easeInOutQuint(0, Math.PI / 2);
    let xValue = Math.sin(distance);
    let yValue = 1 - Math.cos(distance);
    if (inverse) {
      [xValue, yValue] = [yValue, xValue];
    }

    if (value.value > 1 / 3) {
      if (check) {
        toSurface.setOverride(true);
        toSurface.show();
        fromSurface.hide();
        fromSurface.setSurfaceData(from);
        fromSurface.setPosition(fromPos);
        fromSurface.getChild().opacity(1);
        fromSurface.setOverride(false);
      }

      toSurface.setSurfaceData({
        ...from,
        x: value.linear(from.x, to.x, xValue),
        y: value.linear(from.y, to.y, yValue),
        width: value.linear(from.width, to.width, xValue),
        height: value.linear(from.height, to.height, yValue),
        radius: value.easeInOutCubic(from.radius, to.radius),
        color: value.color(from.color, to.color, value.easeInOutQuint()),
      });
      toSurface.setPosition({
        x: value.linear(fromNewPos.x, toPos.x, xValue),
        y: value.linear(fromNewPos.y, toPos.y, yValue),
      });
      toSurface
        .getChild()
        .opacity(Math.max(TimeTween.map(0, 1, value.linear(-1 / 2, 1)), 0));
    } else {
      fromSurface.setOverride(true);
      fromSurface.setSurfaceData({
        ...from,
        x: value.linear(from.x, to.x, xValue),
        y: value.linear(from.y, to.y, yValue),
        width: value.linear(from.width, to.width, xValue),
        height: value.linear(from.height, to.height, yValue),
        radius: value.easeInOutCubic(from.radius, to.radius),
        color: value.color(from.color, to.color, value.easeInOutQuint()),
      });
      fromSurface.setPosition({
        x: value.linear(fromPos.x, toNewPos.x, xValue),
        y: value.linear(fromPos.y, toNewPos.y, yValue),
      });
      fromSurface.getChild().opacity(TimeTween.map(1, 0, value.linear(0, 3)));
    }
  });
}