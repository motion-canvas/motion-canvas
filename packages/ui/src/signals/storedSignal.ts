import {effect, signal, Signal} from '@preact/signals';
import {projectNameSignal} from './projectName';

export function storedSignal<T>(
  value: T,
  id: string,
  parse?: (value: any) => T,
): Signal<T> {
  const stored = signal(value);

  effect(() => {
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

  effect(() => {
    const value = stored.value;
    const name = projectNameSignal.value;
    if (name !== null) {
      localStorage.setItem(`${name}-${id}`, JSON.stringify(value));
    }
  });

  return stored;
}
