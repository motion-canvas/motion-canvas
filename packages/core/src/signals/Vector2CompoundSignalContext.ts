import {InterpolationFunction, TimingFunction} from '../tweening';
import {PossibleVector2, Vector2} from '../types';
import {CompoundSignal, CompoundSignalContext} from './CompoundSignalContext';
import {Signal} from './SignalContext';
import {SignalExtensions, SignalValue} from './types';

export type Vector2Signal<
  TOwner = void,
  TContext = Vector2CompoundSignalContext<TOwner>,
> = CompoundSignal<PossibleVector2, Vector2, 'x' | 'y', TOwner, TContext>;

export class Vector2CompoundSignalContext<
  TOwner = void,
> extends CompoundSignalContext<PossibleVector2, Vector2, 'x' | 'y', TOwner> {
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

    Object.defineProperty(this.invokable, 'scale', {
      value: this.scale.bind(this),
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

  public edit(
    callback: (current: Vector2) => SignalValue<PossibleVector2>,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    const newValue = callback(this.invokable());
    return this.invoke(
      newValue,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public scale(
    value: number,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    return this.edit(
      current => current.scale(value),
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public mul(
    possibleVector: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    return this.edit(
      current => current.mul(possibleVector),
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public div(
    possibleVector: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    return this.edit(
      current => current.div(possibleVector),
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public add(
    possibleVector: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    return this.edit(
      current => current.add(possibleVector),
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public sub(
    possibleVector: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    return this.edit(
      current => current.sub(possibleVector),
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public dot(
    possibleVector: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    return this.edit(
      current => current.dot(possibleVector),
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public cross(
    possibleVector: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    return this.edit(
      current => current.cross(possibleVector),
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public mod(
    possibleVector: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    return this.edit(
      current => current.mul(possibleVector),
      duration,
      timingFunction,
      interpolationFunction,
    );
  }
}
