import {createSignal} from './createSignal';
import {createComputedAsync} from './createComputedAsync';

function sleep(duration = 0) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

describe('createComputedAsync()', () => {
  test('Value is updated when the promise resolves', async () => {
    const computed = createComputedAsync(() => sleep().then(() => true), false);
    const signal = createSignal(() => computed());

    expect(signal()).toBe(false);

    await sleep(1);

    expect(signal()).toBe(true);
  });
});
