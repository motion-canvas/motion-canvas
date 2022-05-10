import type {Node} from 'konva/lib/Node';
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
import {waitFor, waitUntil} from '../animations';
import {ThreadGenerator} from '../threading';
import {GeneratorHelper} from '../helpers';

export interface TweenProvider<T> {
  (
    from: T,
    to: T,
    time: number,
    interpolation: InterpolationFunction,
    onEnd: Function,
  ): ThreadGenerator;
}

export class Animator<Type, This extends Node> {
  private valueFrom: Type = null;
  private lastValue: Type;
  private keys: (() => ThreadGenerator)[] = [];
  private mapper: TweenFunction<any> = map;
  private loops: number = 1;
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

  public key<Rest extends any[]>(
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
                  ? this.mapper(this.valueFrom, value, interpolation(v))
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

  public do(callback: Function): this {
    this.keys.push(function* (): ThreadGenerator {
      callback();
    });

    return this;
  }

  public diff<Rest extends any[]>(
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

  public back<Rest extends any[]>(
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

  public waitUntil(event: string): this
  public waitUntil(time: number): this
  public waitUntil(time: number | string): this {
    // @ts-ignore
    this.keys.push(() => waitUntil(time));
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
    for (let loop = 0; loop < this.loops; loop++) {
      for (let i = 0; i < this.keys.length; i++) {
        yield* this.keys[i]();
      }
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

    if (typeof this.valueFrom === 'string') {
      if (this.valueFrom.startsWith('#') || this.valueFrom.startsWith('rgb')) {
        this.mapper = colorTween;
      } else {
        this.mapper = textTween;
      }
    } else if (this.valueFrom && typeof this.valueFrom === 'object') {
      if ('x' in this.valueFrom) {
        if ('width' in this.valueFrom) {
          this.mapper = rectArcTween;
        }
        this.mapper = vector2dTween;
      } else if ('left' in this.valueFrom) {
        this.mapper = spacingTween;
      }
    }
  }
}
