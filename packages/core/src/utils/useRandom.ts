import {useScene} from './useScene';
import {Random} from '../scenes';

/**
 * Get the random number generator for the current scene.
 **/
export function useRandom(): Random;
/**
 * Get the random number generator for the given seed.
 *
 * @param seed - The seed for the generator.
 * @param fixed - Whether the seed should be fixed. Fixed seeds remain
 *                the same even when the main scene seed changes.
 */
export function useRandom(seed: number, fixed?: boolean): Random;
export function useRandom(seed?: number, fixed = true): Random {
  return typeof seed === 'number'
    ? new Random(fixed ? seed : seed + useScene().meta.getData().seed)
    : useScene().random;
}
