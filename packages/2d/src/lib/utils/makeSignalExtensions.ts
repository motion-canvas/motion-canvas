import {SignalExtensions, capitalize} from '@motion-canvas/core';
import {PropertyMetadata} from '../decorators';

export function makeSignalExtensions<TSetterValue, TValue extends TSetterValue>(
  meta: Partial<PropertyMetadata<TValue>> = {},
  owner?: any,
  name?: string,
) {
  const extensions: Partial<SignalExtensions<TSetterValue, TValue>> = {};

  if (name && owner) {
    const setter = meta.setter ?? owner?.[`set${capitalize(name)}`];
    if (setter) {
      extensions.setter = setter.bind(owner);
    }

    const getter = meta.getter ?? owner?.[`get${capitalize(name)}`];
    if (getter) {
      extensions.getter = getter.bind(owner);
    }

    const tweener = meta.tweener ?? owner?.[`tween${capitalize(name)}`];
    if (tweener) {
      extensions.tweener = tweener.bind(owner);
    }
  }

  return extensions;
}
