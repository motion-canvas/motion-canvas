import {DEFAULT, SimpleSignal} from '@motion-canvas/core';
import {beforeEach, describe, expect, test, vi} from 'vitest';
import {initial, initializeSignals, parser, signal} from './signal';

interface OwnerProps {
  integer?: number;
  custom?: number;
}

class Owner {
  @initial(2.2)
  @parser((value: number) => Math.round(value))
  @signal()
  public declare readonly integer: SimpleSignal<number>;

  @initial(0)
  @signal()
  public declare readonly custom: SimpleSignal<number>;
  public getCustom() {
    return 4;
  }
  public setCustom() {
    // do nothing
  }

  public constructor(props: OwnerProps = {}) {
    initializeSignals(this, props);
  }
}

const GetterMock = vi.spyOn(Owner.prototype, 'getCustom');
const SetterMock = vi.spyOn(Owner.prototype, 'setCustom');

describe('signal', () => {
  beforeEach(() => {
    GetterMock.mockClear();
    SetterMock.mockClear();
  });

  test('Has initial value', () => {
    const instance = new Owner();

    expect(instance.integer()).toBe(2);
    expect(instance.integer.isInitial()).toBe(true);
  });

  test('Overrides the value', () => {
    const instance = new Owner({integer: 4});

    expect(instance.integer()).toBe(4);
    expect(instance.integer.isInitial()).toBe(false);
  });

  test('Resets the value to default', () => {
    const instance = new Owner({integer: 4});
    instance.integer(DEFAULT);

    expect(instance.integer()).toBe(2);
    expect(instance.integer.isInitial()).toBe(true);
  });

  test('Parses the value', () => {
    const instance = new Owner();
    instance.integer(2.7);

    expect(instance.integer()).toBe(3);
  });

  test('Uses the custom getter', () => {
    const instance = new Owner();
    const value = instance.custom();

    expect(value).toBe(4);
    expect(GetterMock).toBeCalledTimes(1);
  });

  test('Calls the setter with the initial value', () => {
    new Owner();

    expect(SetterMock).toBeCalledWith(0);
  });

  test('Uses the setter', () => {
    const instance = new Owner({custom: 1});
    instance.custom(2);

    expect(SetterMock).toBeCalledTimes(3);
  });
});
