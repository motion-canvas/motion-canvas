import {ISubscribable} from 'strongly-typed-events';
import {useEffect, useState} from 'preact/hooks';

export function useEventState<Type>(
  subscribable: ISubscribable<(args: Type) => void>,
  getState: () => Type,
): Type {
  const [state, setState] = useState(getState());
  useEffect(() => {
    setState(getState());
    subscribable.subscribe(setState);
    return () => subscribable.unsubscribe(setState);
  }, [subscribable]);

  return state;
}
