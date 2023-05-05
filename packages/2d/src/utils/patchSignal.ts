import {capitalize} from '@motion-canvas/core/lib/utils';
import {SignalContext} from '@motion-canvas/core/lib/signals';
import {PropertyMetadata} from '../decorators';

export function patchSignal<TSetterValue, TValue extends TSetterValue>(
  signal: SignalContext<TSetterValue, TValue>,
  meta: Partial<PropertyMetadata<TValue>> = {},
  owner?: any,
  name?: string,
) {
  if (meta.parser) {
    signal.setParser(meta.parser.bind(owner));
  }

  if (name && owner) {
    const setter = meta.setter ?? owner?.[`set${capitalize(name)}`];
    if (setter) {
      signal.set = (...args: any[]) => {
        setter.apply(owner, args);
        return owner;
      };
    }
    const getter = meta.getter ?? owner?.[`get${capitalize(name)}`];
    if (getter) {
      signal.get = getter.bind(owner);
    }
    const tweener = meta.tweener ?? owner?.[`tween${capitalize(name)}`];
    if (tweener) {
      signal.doTween = tweener.bind(owner);
    }
  }
}
