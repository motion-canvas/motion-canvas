import {Inputs, useLayoutEffect, useRef} from 'preact/hooks';

export function useStateChange<T extends Inputs>(
  onChange: (prev: T) => void,
  inputs: T,
) {
  const previous = useRef(inputs);
  useLayoutEffect(() => {
    onChange(previous.current);
    previous.current = inputs;
  }, inputs);
}
