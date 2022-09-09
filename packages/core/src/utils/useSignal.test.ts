import {useSignal} from './useSignal';

describe('useSignal()', () => {
  test('Works correctly with plain values', () => {
    const signal = useSignal(7);

    expect(signal()).toBe(7);

    signal(3);

    expect(signal()).toBe(3);
  });

  test('Works correctly with computed values', () => {
    const signal = useSignal(() => 7);

    expect(signal()).toBe(7);

    signal(() => 3);

    expect(signal()).toBe(3);
  });

  test('Value is updated when its dependencies change', () => {
    const a = useSignal(1);
    const b = useSignal(true);
    const c = useSignal(2);
    const d = useSignal(() => (b() ? a() : c()));

    expect(d()).toBe(1);

    a(3);

    expect(d()).toBe(3);

    b(false);

    expect(d()).toBe(2);

    c(4);

    expect(d()).toBe(4);
  });

  test('Value is cached and recalculated only when necessary', () => {
    const a = useSignal(1);

    const value = jest.fn(() => a() * 2);
    const c = useSignal(value);

    expect(value.mock.calls.length).toBe(0);

    a(2);

    expect(value.mock.calls.length).toBe(0);

    c();
    c();

    expect(value.mock.calls.length).toBe(1);
  });

  test('onChanged events are dispatched only once per handler', () => {
    const handler = jest.fn();
    const c = useSignal(0);

    c(1);

    c.onChanged.subscribe(handler);
    expect(handler.mock.calls.length).toBe(1);

    c(2);
    c(3);

    expect(handler.mock.calls.length).toBe(1);
  });
});
