import {Animator} from '../tweening';

export function useAnimator<T>(initial: T, onUpdate: (value: T) => void) {
  const object = {
    value: initial,
    setValue(value: T) {
      this.value = value;
      onUpdate(value);
    },
    getValue(): T {
      return this.value;
    },
  };

  return () => new Animator<T, typeof object>(object, 'value');
}
