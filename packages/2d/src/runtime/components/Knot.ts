import {
  PossibleVector2,
  Signal,
  SignalValue,
  Vector2,
  Vector2Signal,
} from '@motion-canvas/core';
import {KnotInfo} from '../curves';
import {
  cloneable,
  compound,
  computed,
  initial,
  parser,
  signal,
  wrapper,
} from '../decorators';
import {Node, NodeProps} from './Node';

export interface KnotProps extends NodeProps {
  /**
   * {@inheritDoc Knot.startHandle}
   */
  startHandle?: SignalValue<PossibleVector2>;
  /**
   * {@inheritDoc Knot.endHandle}
   */
  endHandle?: SignalValue<PossibleVector2>;
  /**
   * {@inheritDoc Knot.auto}
   */
  auto?: SignalValue<PossibleKnotAuto>;
  startHandleAuto?: SignalValue<number>;
  endHandleAuto?: SignalValue<number>;
}

export type KnotAuto = {startHandle: number; endHandle: number};
export type PossibleKnotAuto = KnotAuto | number | [number, number];
export type KnotAutoSignal<TOwner> = Signal<
  PossibleKnotAuto,
  KnotAuto,
  TOwner
> & {
  endHandle: Signal<number, number, TOwner>;
  startHandle: Signal<number, number, TOwner>;
};

/**
 * A node representing a knot of a {@link Spline}.
 */
export class Knot extends Node {
  /**
   * The position of the knot's start handle. The position is provided relative
   * to the knot's position.
   *
   * @remarks
   * By default, the position of the start handle will be the mirrored position
   * of the {@link endHandle}.
   *
   * If neither an end handle nor a start handle is provided, the positions of
   * the handles gets calculated automatically to create smooth curve through
   * the knot. The smoothness of the resulting curve can be controlled via the
   * {@link Spline.smoothness} property.
   *
   * It is also possible to blend between a user-defined position and the
   * auto-calculated position by using the {@link auto} property.
   *
   * @defaultValue Mirrored position of the endHandle.
   */
  @wrapper(Vector2)
  @signal()
  public declare readonly startHandle: Vector2Signal<this>;

  /**
   * The position of the knot's end handle. The position is provided relative
   * to the knot's position.
   *
   * @remarks
   * By default, the position of the end handle will be the mirrored position
   * of the {@link startHandle}.
   *
   * If neither an end handle nor a start handle is provided, the positions of
   * the handles gets calculated automatically to create smooth curve through
   * the knot. The smoothness of the resulting curve can be controlled via the
   * {@link Spline.smoothness} property.
   *
   * It is also possible to blend between a user-defined position and the
   * auto-calculated position by using the {@link auto} property.
   *
   * @defaultValue Mirrored position of the startHandle.
   */
  @wrapper(Vector2)
  @signal()
  public declare readonly endHandle: Vector2Signal<this>;

  /**
   * How much to blend between the user-provided handles and the auto-calculated
   * handles.
   *
   * @remarks
   * This property has no effect if no explicit handles are provided for the
   * knot.
   *
   * @defaultValue 0
   */
  @cloneable(false)
  @initial(() => ({startHandle: 0, endHandle: 0}))
  @parser((value: PossibleKnotAuto) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'number') {
      value = [value, value];
    }
    return {startHandle: value[0], endHandle: value[1]};
  })
  @compound({startHandle: 'startHandleAuto', endHandle: 'endHandleAuto'})
  public declare readonly auto: KnotAutoSignal<this>;
  public get startHandleAuto() {
    return this.auto.startHandle;
  }
  public get endHandleAuto() {
    return this.auto.endHandle;
  }

  public constructor(props: KnotProps) {
    super(
      props.startHandle === undefined && props.endHandle === undefined
        ? {auto: 1, ...props}
        : props,
    );
  }

  @computed()
  public points(): KnotInfo {
    const hasExplicitHandles =
      !this.startHandle.isInitial() || !this.endHandle.isInitial();
    const startHandle = hasExplicitHandles ? this.startHandle() : Vector2.zero;
    const endHandle = hasExplicitHandles ? this.endHandle() : Vector2.zero;

    return {
      position: this.position(),
      startHandle: startHandle.transformAsPoint(this.localToParent()),
      endHandle: endHandle.transformAsPoint(this.localToParent()),
      auto: {start: this.startHandleAuto(), end: this.endHandleAuto()},
    };
  }

  private getDefaultEndHandle() {
    return this.startHandle().flipped;
  }

  private getDefaultStartHandle() {
    return this.endHandle().flipped;
  }
}
