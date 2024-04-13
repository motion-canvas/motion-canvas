import {
  deepLerp,
  map,
  modify,
  PossibleVector2,
  Signal,
  SignalContext,
  useLogger,
  Vector2,
  Vector2CompoundSignalContext,
} from '@motion-canvas/core';
import type {Length} from '../partials';
import {makeSignalExtensions} from '../utils/makeSignalExtensions';
import {addInitializer} from './initializers';
import {getPropertyMetaOrCreate, wrapper} from './signal';

export type Vector2LengthSignal<TOwner> = Signal<
  PossibleVector2<Length>,
  Vector2,
  TOwner
> & {
  x: Signal<Length, number, TOwner>;
  y: Signal<Length, number, TOwner>;
};

export function vector2Signal(
  prefix?: string | Record<string, string>,
): PropertyDecorator {
  return (target, key) => {
    compoundVector2Signal(
      typeof prefix === 'object'
        ? prefix
        : {
            x: prefix ? `${prefix}X` : 'x',
            y: prefix ? `${prefix}Y` : 'y',
          },
    )(target, key);
    wrapper(Vector2)(target, key);
  };
}

function compoundVector2Signal(
  entries: Record<string, string>,
): PropertyDecorator {
  return (target, key) => {
    const meta = getPropertyMetaOrCreate<any>(target, key);
    meta.compound = true;
    meta.compoundEntries = Object.entries(entries);

    addInitializer(target, (instance: any) => {
      if (!meta.parser) {
        useLogger().error(`Missing parser decorator for "${key.toString()}"`);
        return;
      }

      const initial = meta.default;
      const parser = meta.parser.bind(instance);
      const signalContext = new Vector2CompoundSignalContext(
        meta.compoundEntries.map(([key, property]) => {
          const signal = new SignalContext(
            modify(initial, value => parser(value)[key]),
            <any>map,
            instance,
            undefined,
            makeSignalExtensions(undefined, instance, property),
          ).toSignal();
          return [<keyof Vector2>key, signal];
        }),
        parser,
        initial,
        meta.interpolationFunction ?? deepLerp,
        instance,
        makeSignalExtensions(meta, instance, <string>key),
      );

      instance[key] = signalContext.toSignal();
    });
  };
}
