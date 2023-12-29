import type {
  EventHandler,
  Subscribable,
  SubscribableValueEvent,
} from '@motion-canvas/core';
import {Inputs, useEffect, useState} from 'preact/hooks';

export function useSubscribable<TValue, THandler extends EventHandler<TValue>>(
  event: Subscribable<TValue, THandler>,
  handler: THandler,
  inputs: Inputs,
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
