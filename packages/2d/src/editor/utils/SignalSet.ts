import {signal} from '@preact/signals';

export class SignalSet<T> {
  private readonly set = new Set<T>();
  private readonly signal = signal(0);

  public has(value: T) {
    this.signal.value;
    return this.set.has(value);
  }

  public peekHas(value: T) {
    return this.set.has(value);
  }

  public add(value: T): boolean {
    if (this.set.has(value)) {
      return false;
    }

    this.set.add(value);
    this.signal.value++;
    return true;
  }

  public delete(value: T): boolean {
    const result = this.set.delete(value);
    if (result) {
      this.signal.value++;
    }
    return result;
  }

  public toggle(value: T, state: boolean): boolean {
    return state ? this.add(value) : this.delete(value);
  }
}
