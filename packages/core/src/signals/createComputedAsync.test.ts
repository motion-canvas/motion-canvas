import {describe, expect, test} from 'vitest';

import {createComputedAsync} from './createComputedAsync';
import {createSignal} from './createSignal';

function sleep(duration = 0) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

describe('createComputedAsync()', () => {
  test('Value is updated when the promise resolves', async () => {
    const computed = createComputedAsync(async () => {
      await sleep();
      return true;
    }, false);
    const signal = createSignal(() => computed());

    expect(signal()).toBe(false);

    await sleep(1);

    expect(signal()).toBe(true);
  });
  test('Value is updated when its dependencies change', async () => {
    const dependency = createSignal(2);
    const computed = createComputedAsync(async () => {
      const value = dependency();
      await sleep();
      return value;
    }, 1);
    const signal = createSignal(() => computed());

    expect(signal()).toBe(1);

    await sleep(1);
    expect(signal()).toBe(2);

    dependency(3);
    expect(signal()).toBe(2);

    await sleep(1);
    expect(signal()).toBe(3);
  });
});
