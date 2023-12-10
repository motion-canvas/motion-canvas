import {describe, expect, test, vi} from 'vitest';
import {createComputed} from './createComputed';
import {createSignal} from './createSignal';

describe('createComputed()', () => {
  test('Value is updated when its dependencies change', () => {
    const a = createSignal(1);
    const b = createSignal(true);
    const c = createSignal(2);
    const d = createComputed(() => (b() ? a() : c()));

    expect(d()).toBe(1);

    a(3);

    expect(d()).toBe(3);

    b(false);

    expect(d()).toBe(2);

    c(4);

    expect(d()).toBe(4);
  });

  test('Value is cached and recalculated only when necessary', () => {
    const a = createSignal(1);

    const value = vi.fn(() => a() * 2);
    const c = createComputed(value);

    expect(value.mock.calls.length).toBe(0);

    a(2);

    expect(value.mock.calls.length).toBe(0);

    c();
    c();

    expect(value.mock.calls.length).toBe(1);
  });
});
