import {capitalize} from '@motion-canvas/core/lib/utils';
import {SignalContext} from '@motion-canvas/core/lib/signals';

export function patchSignal<TSetterValue, TValue extends TSetterValue>(
  signal: SignalContext<TSetterValue, TValue>,
  parser?: (value: TSetterValue) => TValue,
  owner?: any,
  name?: string,
) {
  if (parser) {
    signal.setParser(parser);
  }

  if (name && owner) {
    const setter = owner?.[`set${capitalize(name)}`];
    if (setter) {
      signal.set = setter.bind(owner);
    }
    const getter = owner?.[`get${capitalize(name)}`];
    if (getter) {
      signal.get = getter.bind(owner);
    }
    const tweener = owner?.[`tween${capitalize(name)}`];
    if (tweener) {
      signal.doTween = tweener.bind(owner);
    }
  }
}
