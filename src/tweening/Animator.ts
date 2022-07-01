import {
  colorTween,
  easeInOutCubic,
  InterpolationFunction,
  map,
  rectArcTween,
  spacingTween,
  textTween,
  tween,
  TweenFunction,
  vector2dTween,
} from './index';
import {threadable} from '../decorators';
import {waitFor, waitUntil} from '../flow';
import {ThreadGenerator} from '../threading';
import {GeneratorHelper} from '../helpers';

export interface TweenProvider<T> {
  (
    from: T,
    to: T,
    time: number,
    interpolation: InterpolationFunction,
    onEnd: Callback,
  ): ThreadGenerator;
}

export class Animator<Type, This> {
  private valueFrom: Type = null;
  private lastValue: Type;
  private keys: (() => ThreadGenerator)[] = [];
  private tweenFunction: TweenFunction<any> = map;
  private loops = 1;
  private readonly setter: string;
  private readonly getter: string;

  public constructor(
    private readonly object: This,
    private readonly prop: string,
    private readonly tweenProvider?: TweenProvider<Type>,
  ) {
    const name = this.prop.charAt(0).toUpperCase() + this.prop.slice(1);
    this.getter = `get${name}`;
    this.setter = `set${name}`;
  }

  public from(value: Type): this {
    this.valueFrom = value;
    return this;
  }

  public key<Rest extends unknown[]>(
    value: Type,
    time: number,
    interpolation: InterpolationFunction = easeInOutCubic,
    mapper?: TweenFunction<Type, Rest>,
    ...args: Rest
  ): this {
    this.lastValue = value;
    this.keys.push(() =>
      GeneratorHelper.isThreadable(this.tweenProvider)
        ? this.tweenProvider.call(
            this.object,
            this.valueFrom,
            value,
            time,
            interpolation,
            () => (this.valueFrom = value),
          )
        : tween(
            time,
            v => {
              // @ts-ignore
              this.object[this.setter](
                mapper === undefined
                  ? this.tweenFunction(this.valueFrom, value, interpolation(v))
                  : mapper(this.valueFrom, value, interpolation(v), ...args),
              );
            },
            () => {
              this.valueFrom = value;
            },
          ),
    );

    return this;
  }

  public do(callback: Callback): this {
    this.keys.push(function* (): ThreadGenerator {
      callback();
    });

    return this;
  }

  public diff<Rest extends unknown[]>(
    value: Type,
    time: number,
    interpolation: InterpolationFunction = easeInOutCubic,
    mapper?: TweenFunction<Type, Rest>,
    ...args: Rest
  ): this {
    let next: any = value;
    const last: any =
      this.lastValue === undefined ? this.getValueFrom() : this.lastValue;
    if (Array.isArray(last)) {
      next = last.map((value1, index) => value1 + next[index]);
    } else if (typeof last === 'object') {
      for (const key in last) {
        next[key] += last[key];
      }
    } else {
      next += last;
    }

    return this.key(next, time, interpolation, mapper, ...args);
  }

  public back<Rest extends unknown[]>(
    time: number,
    interpolation: InterpolationFunction = easeInOutCubic,
    mapper?: TweenFunction<Type, Rest>,
    ...args: Rest
  ): this {
    return this.key(this.getValueFrom(), time, interpolation, mapper, ...args);
  }

  public waitFor(time: number): this {
    this.keys.push(() => waitFor(time));
    return this;
  }

  public waitUntil(event: string): this {
    this.keys.push(() => waitUntil(event));
    return this;
  }

  public run(loops = 1): ThreadGenerator {
    this.loops = loops;
    if (this.valueFrom !== null) {
      //@ts-ignore
      this.object[this.setter](this.valueFrom);
    }
    this.inferProperties();
    return this.runner();
  }

  @threadable('animatorRunner')
  private *runner(): ThreadGenerator {
    const valueFrom = this.valueFrom;
    for (let loop = 0; loop < this.loops; loop++) {
      for (let i = 0; i < this.keys.length; i++) {
        yield* this.keys[i]();
      }
      this.valueFrom = valueFrom;
    }
  }

  private getValueFrom(): Type {
    if (this.valueFrom !== null) {
      return this.valueFrom;
    }

    if (this.getter in this.object) {
      //@ts-ignore
      return this.object[this.getter]();
    }
  }

  private inferProperties() {
    this.valueFrom ??= this.getValueFrom();
    this.tweenFunction = Animator.inferTweenFunction(this.valueFrom);
  }

  public static inferTweenFunction<T>(value: T): TweenFunction<T> {
    let tween: TweenFunction<unknown> = map;

    if (typeof value === 'string') {
      if (value.startsWith('#') || value.startsWith('rgb')) {
        tween = colorTween;
      } else {
        tween = textTween;
      }
    } else if (value && typeof value === 'object') {
      if ('x' in value) {
        if ('width' in value) {
          tween = rectArcTween;
        } else {
          tween = vector2dTween;
        }
      } else if ('left' in value) {
        tween = spacingTween;
      }
    }

    return tween as TweenFunction<T>;
  }
}
