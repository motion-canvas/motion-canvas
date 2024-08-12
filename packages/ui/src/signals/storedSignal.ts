import {Signal, useSignal, useSignalEffect} from '@preact/signals';
import {projectNameSignal} from './projectName';

export function storedSignal<T>(
  value: T,
  id: string,
  parse?: (value: any) => T,
): Signal<T> {
  const stored = useSignal(value);

  useSignalEffect(() => {
    const name = projectNameSignal.value;
    if (name !== null) {
      const storedValue = localStorage.getItem(`${name}-${id}`);
      if (storedValue !== null) {
        try {
          const deserialized = JSON.parse(storedValue);
          stored.value = parse ? parse(deserialized) : deserialized;
        } catch (_) {
          localStorage.setItem(`${name}-${id}`, JSON.stringify(value));
        }
      }
    }
  });

  useSignalEffect(() => {
    const value = stored.value;
    const name = projectNameSignal.value;
    if (name !== null) {
      localStorage.setItem(`${name}-${id}`, JSON.stringify(value));
    }
  });

  return stored;
}
