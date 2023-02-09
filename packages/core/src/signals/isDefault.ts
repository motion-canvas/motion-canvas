import {Signal} from './SignalContext';

export function isDefault<TSetterValue, TValue extends TSetterValue, TOwner>(
  signal: Signal<TSetterValue, TValue, TOwner>,
) {
  signal.context['collect']();
  return (
    signal.context['compute'] !== undefined &&
    signal.context.raw() === signal.context['compute']
  );
}
