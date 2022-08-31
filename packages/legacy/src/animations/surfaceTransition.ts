import {Surface} from '../components';
import {
  calculateRatio,
  clampRemap,
  colorTween,
  easeInOutCubic,
  easeInOutQuint,
  rectArcTween,
  tween,
} from '@motion-canvas/core/lib/tweening';
import {decorate, threadable} from '@motion-canvas/core/lib/decorators';
import {ThreadGenerator} from '@motion-canvas/core/lib/threading';

/**
 * Configuration for {@link surfaceTransition}.
 *
 * @remarks
 * For {@link SurfaceTransitionConfig.onInitialSurfaceUpdate | `onInitialSurfaceUpdate`}
 * and {@link SurfaceTransitionConfig.onTargetSurfaceUpdate | `onTargetSurfaceUpdate`}
 * callbacks, the `value` and `relativeValue` arguments represent the absolute
 * and relative completion of the transition:
 * ```text
 *
 *     start     onSurfaceChange             end
 *       │              │                     │
 *       │ 0 <──────────┼─────────────────> 1 │  <- value
 *       │ 0 <──────> 1 │ 0 <─────────────> 1 │  <- relativeValue
 * ──────┴──── from ────┴──────── to ─────────┴───────────────────────>
 *                                                              time
 * ```
 */
export interface SurfaceTransitionConfig {
  /**
   * Whether the transition arc should be reversed.
   *
   * @remarks
   * See {@link rectArcTween} for more detail.
   */
  reverse?: boolean;
  /**
   * A function called when the currently displayed surface changes.
   *
   * @param surface - The new surface.
   */
  onSurfaceChange?: (surface: Surface) => void;
  /**
   * A function called when the initial surface is updated.
   *
   * @param surface - The initial surface.
   * @param value - Completion of the entire transition.
   * @param relativeValue - Relative completion of the transition.
   *
   * @returns `true` if the default changes made by {@link surfaceTransition}
   *          should be prevented
   */
  onInitialSurfaceUpdate?: (
    surface: Surface,
    value: number,
    relativeValue: number,
  ) => true | void;
  /**
   * A function called when the target surface is updated.
   *
   * @param surface - The target surface.
   * @param value - Completion of the entire transition.
   * @param relativeValue - Relative completion of the transition.
   *
   * @returns `true` if the default changes made by {@link surfaceTransition}
   *          should be prevented
   */
  onTargetSurfaceUpdate?: (
    surface: Surface,
    value: number,
    relativeValue: number,
  ) => true | void;
  /**
   * Duration at which the surfaces are swapped.
   */
  transitionTime?: number;
  duration?: number;
}

decorate(surfaceTransition, threadable());
/**
 * Morph one surface into another.
 *
 * @param initial - The initial surface.
 * @param target - The target surface.
 * @param config - Additional configuration.
 */
export function* surfaceTransition(
  initial: Surface,
  target: Surface,
  config: SurfaceTransitionConfig = {},
): ThreadGenerator {
  const from = initial.getMask();

  const transitionTime = config.transitionTime ?? 1 / 3;
  const to = target.getMask();
  const toPos = target.getPosition();
  const fromPos = initial.getPosition();

  const fromDelta = initial.getOriginDelta(target.getOrigin());
  const fromNewPos = {
    x: fromPos.x + fromDelta.x,
    y: fromPos.y + fromDelta.y,
  };
  const toDelta = target.getOriginDelta(initial.getOrigin());
  const toNewPos = {
    x: toPos.x + toDelta.x,
    y: toPos.y + toDelta.y,
  };

  const ratio =
    (calculateRatio(fromNewPos, toPos) + calculateRatio(from, to)) / 2;

  target.hide();
  config.onSurfaceChange?.(initial);

  let check = true;
  let relativeValue = 0;
  yield* tween(config.duration ?? 0.6, value => {
    if (value > transitionTime) {
      relativeValue = clampRemap(transitionTime, 1, 0, 1, value);
      if (check) {
        target.show();
        initial.hide();
      }
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
      if (!config.onTargetSurfaceUpdate?.(target, value, relativeValue)) {
        target.getChild().opacity(relativeValue);
      }

      if (check) {
        config.onSurfaceChange?.(target);
        check = false;
      }
    } else {
      relativeValue = clampRemap(0, transitionTime, 1, 0, value);
      initial.setMask({
        ...from,
        ...rectArcTween(from, to, easeInOutQuint(value), config.reverse, ratio),
        radius: easeInOutCubic(value, from.radius, target.radius()),
        color: colorTween(
          from.color,
          target.background(),
          easeInOutQuint(value),
        ),
      });
      initial.setPosition(
        rectArcTween(
          fromPos,
          toNewPos,
          easeInOutQuint(value),
          config.reverse,
          ratio,
        ),
      );

      if (!config.onInitialSurfaceUpdate?.(target, value, relativeValue)) {
        initial.getChild().opacity(relativeValue);
      }
    }
  });

  initial.position(fromPos).setMask(null);
  target.position(toPos).setMask(null);
}
