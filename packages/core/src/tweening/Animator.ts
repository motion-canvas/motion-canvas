import {
  colorLerp,
  easeInOutCubic,
  TimingFunction,
  map,
  textLerp,
  tween,
  InterpolationFunction,
  deepLerp,
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
    timingFunction: TimingFunction,
    onEnd: Callback,
  ): ThreadGenerator;
}

export class Animator<Type, This> {
  private valueFrom: Type = null;
  private lastValue: Type;
  private keys: (() => ThreadGenerator)[] = [];
  private interpolationFunction: InterpolationFunction<any> = map;
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
    timingFunction: TimingFunction = easeInOutCubic,
    interpolationFunction?: InterpolationFunction<Type, Rest>,
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
            timingFunction,
            () => (this.valueFrom = value),
          )
        : tween(
            time,
            v => {
              // @ts-ignore
              this.object[this.setter](
                interpolationFunction === undefined
                  ? this.interpolationFunction(
                      this.valueFrom,
                      value,
                      timingFunction(v),
                    )
                  : interpolationFunction(
                      this.valueFrom,
                      value,
                      timingFunction(v),
                      ...args,
                    ),
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
    timingFunction: TimingFunction = easeInOutCubic,
    interpolationFunction?: InterpolationFunction<Type, Rest>,
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

    return this.key(next, time, timingFunction, interpolationFunction, ...args);
  }

  public back<Rest extends unknown[]>(
    time: number,
    timingFunction: TimingFunction = easeInOutCubic,
    interpolationFunction?: InterpolationFunction<Type, Rest>,
    ...args: Rest
  ): this {
    return this.key(
      this.getValueFrom(),
      time,
      timingFunction,
      interpolationFunction,
      ...args,
    );
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
    this.interpolationFunction = Animator.inferInterpolationFunction(
      this.valueFrom,
    );
  }

  public static inferInterpolationFunction<T>(
    value: T,
  ): InterpolationFunction<T> {
    let interpolationFunction: InterpolationFunction<unknown> = map;

    if (typeof value === 'string') {
      if (value.startsWith('#') || value.startsWith('rgb')) {
        interpolationFunction = colorLerp;
      } else {
        interpolationFunction = textLerp;
      }
    } else if (value && typeof value === 'object') {
      interpolationFunction = deepLerp;
    }

    return interpolationFunction as InterpolationFunction<T>;
  }
}
