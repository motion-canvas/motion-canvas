import {describe, expect, test, vi} from 'vitest';
import {createSignal} from './createSignal';

import {createEffect} from './createEffect';

describe('createEffect()', () => {
  test('Invoked after creation', () => {
    const callback = vi.fn();
    createEffect(callback);

    expect(callback).toBeCalled();
  });

  test('Invoked when dependencies change', () => {
    const a = createSignal(1);
    const b = createSignal(2);
    const callback = vi.fn(() => {
      a();
      b();
    });
    createEffect(callback);

    a(2);
    a(3);
    b(3);
    b(4);

    expect(callback).toBeCalledTimes(5);
  });

  test('Not invoked after unsubscribing', () => {
    const a = createSignal(1);
    const b = createSignal(2);
    const callback = vi.fn(() => {
      a();
      b();
    });
    const unsub = createEffect(callback);

    a(2);
    b(3);

    unsub();

    a(3);
    b(4);

    expect(callback).toBeCalledTimes(3);
  });
});
