import {InterpolationFunction, TimingFunction} from '../tweening';
import {PossibleVector2, Vector2} from '../types';
import {CompoundSignal, CompoundSignalContext} from './CompoundSignalContext';
import {Signal} from './SignalContext';
import {SignalExtensions, SignalGenerator, SignalValue} from './types';

export interface Vector2Edit<TOwner> {
  (callback: (current: Vector2) => SignalValue<PossibleVector2>): TOwner;
  (
    callback: (current: Vector2) => SignalValue<PossibleVector2>,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
}

export interface Vector2Operation<TOwner> {
  (value: PossibleVector2): TOwner;
  (
    value: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
}

export interface Vector2SignalHelpers<TOwner> {
  edit: Vector2Edit<TOwner>;
  mul: Vector2Operation<TOwner>;
  div: Vector2Operation<TOwner>;
  add: Vector2Operation<TOwner>;
  sub: Vector2Operation<TOwner>;
  dot: Vector2Operation<TOwner>;
  cross: Vector2Operation<TOwner>;
  mod: Vector2Operation<TOwner>;
}

export type Vector2Signal<
  TOwner = void,
  TContext = Vector2SignalContext<TOwner>,
> = CompoundSignal<PossibleVector2, Vector2, 'x' | 'y', TOwner, TContext> &
  Vector2SignalHelpers<TOwner>;

export class Vector2SignalContext<TOwner = void>
  extends CompoundSignalContext<PossibleVector2, Vector2, 'x' | 'y', TOwner>
  implements Vector2SignalHelpers<TOwner>
{
  public constructor(
    entries: ('x' | 'y' | [keyof Vector2, Signal<any, any, TOwner>])[],
    parser: (value: PossibleVector2) => Vector2,
    initial: SignalValue<PossibleVector2>,
    interpolation: InterpolationFunction<Vector2>,
    owner: TOwner = <TOwner>(<unknown>undefined),
    extensions: Partial<SignalExtensions<PossibleVector2, Vector2>> = {},
  ) {
    super(entries, parser, initial, interpolation, owner, extensions);

    Object.defineProperty(this.invokable, 'edit', {
      value: this.edit.bind(this),
    });

    Object.defineProperty(this.invokable, 'mul', {
      value: this.mul.bind(this),
    });

    Object.defineProperty(this.invokable, 'div', {
      value: this.div.bind(this),
    });

    Object.defineProperty(this.invokable, 'add', {
      value: this.add.bind(this),
    });

    Object.defineProperty(this.invokable, 'sub', {
      value: this.sub.bind(this),
    });

    Object.defineProperty(this.invokable, 'dot', {
      value: this.dot.bind(this),
    });

    Object.defineProperty(this.invokable, 'cross', {
      value: this.cross.bind(this),
    });

    Object.defineProperty(this.invokable, 'mod', {
      value: this.mod.bind(this),
    });
  }

  public override toSignal(): Vector2Signal<TOwner> {
    return this.invokable;
  }

  public edit(
    callback: (current: Vector2) => SignalValue<PossibleVector2>,
  ): TOwner;
  public edit(
    callback: (current: Vector2) => SignalValue<PossibleVector2>,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
  public edit(
    callback: (current: Vector2) => SignalValue<PossibleVector2>,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2> | TOwner {
    const newValue = callback(this.get());
    return this.invoke(
      newValue,
      duration,
      timingFunction,
      interpolationFunction,
    ) as SignalGenerator<PossibleVector2, Vector2> | TOwner;
  }

  public mul(value: PossibleVector2): TOwner;
  public mul(
    value: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
  public mul(
    value: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2> | TOwner {
    const callback = (current: Vector2) => current.mul(value);
    if (duration === undefined) return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }

  public div(value: PossibleVector2): TOwner;
  public div(
    value: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
  public div(
    value: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2> | TOwner {
    const callback = (current: Vector2) => current.div(value);
    if (duration === undefined) return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }

  public add(value: PossibleVector2): TOwner;
  public add(
    value: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
  public add(
    value: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2> | TOwner {
    const callback = (current: Vector2) => current.add(value);
    if (duration === undefined) return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }

  public sub(value: PossibleVector2): TOwner;
  public sub(
    value: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
  public sub(
    value: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2> | TOwner {
    const callback = (current: Vector2) => current.sub(value);
    if (duration === undefined) return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }

  public dot(value: PossibleVector2): TOwner;
  public dot(
    value: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
  public dot(
    value: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2> | TOwner {
    const callback = (current: Vector2) => current.dot(value);
    if (duration === undefined) return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }

  public cross(value: PossibleVector2): TOwner;
  public cross(
    value: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
  public cross(
    value: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2> | TOwner {
    const callback = (current: Vector2) => current.cross(value);
    if (duration === undefined) return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }

  public mod(value: PossibleVector2): TOwner;
  public mod(
    value: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2>;
  public mod(
    value: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ): SignalGenerator<PossibleVector2, Vector2> | TOwner {
    const callback = (current: Vector2) => current.mod(value);
    if (duration === undefined) return this.edit(callback);
    return this.edit(callback, duration, timingFunction, interpolationFunction);
  }
}
