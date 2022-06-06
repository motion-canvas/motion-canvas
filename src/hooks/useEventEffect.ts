import {ISubscribable} from 'strongly-typed-events';
import {Inputs, useEffect} from 'preact/hooks';

export function useEventEffect<THandler extends Function>(
  subscribable: ISubscribable<THandler>,
  callback: THandler,
  inputs: Inputs,
): void {
  useEffect(() => {
    subscribable.subscribe(callback);
    return () => subscribable.unsubscribe(callback);
  }, inputs);
}
