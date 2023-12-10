import type {
  EventHandler,
  Subscribable,
  SubscribableValueEvent,
} from '@motion-canvas/core';
import {DependencyList, useEffect, useState} from 'react';

export function useSubscribable<TValue, THandler extends EventHandler<TValue>>(
  event: Subscribable<TValue, THandler>,
  handler: THandler,
  inputs: DependencyList,
) {
  useEffect(() => event?.subscribe(handler), [event, ...inputs]);
}

export function useSubscribableValue<TValue>(
  value: SubscribableValueEvent<TValue>,
) {
  const [state, setState] = useState(value?.current);
  useEffect(() => value && value.subscribe(setState), [value]);
  return state;
}
