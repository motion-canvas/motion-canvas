import {map} from '../tweening';
import {range} from '../utils';

/**
 * A random number generator based on
 * {@link https://gist.github.com/tommyettinger/46a874533244883189143505d203312c | Mulberry32}.
 */
export class Random {
  /**
   * Previously generated Gaussian random number.
   *
   * @remarks
   * This is an optimization.
   * Since {@link gauss} generates a pair of independent Gaussian random
   * numbers, it returns one immediately and stores the other for the next call
   * to {@link gauss}.
   */
  private nextGauss: number | null = null;

  public constructor(private state: number) {}

  /**
   * @internal
   */
  public static createSeed() {
    return Math.floor(Math.random() * 4294967296);
  }

  /**
   * Get the next random float in the given range.
   *
   * @param from - The start of the range.
   * @param to - The end of the range.
   */
  public nextFloat(from = 0, to = 1) {
    return map(from, to, this.next());
  }

  /**
   * Get the next random integer in the given range.
   *
   * @param from - The start of the range.
   * @param to - The end of the range. Exclusive.
   */
  public nextInt(from = 0, to = 4294967296) {
    let value = Math.floor(map(from, to, this.next()));
    if (value === to) {
      value = from;
    }

    return value;
  }

  /**
   * Get a random float from a gaussian distribution.
   * @param mean - The mean of the distribution.
   * @param stdev - The standard deviation of the distribution.
   */
  public gauss(mean = 0, stdev = 1): number {
    let z = this.nextGauss;
    this.nextGauss = null;
    if (z === null) {
      const x2pi = this.next() * 2 * Math.PI;
      const g2rad = Math.sqrt(-2 * Math.log(1 - this.next()));
      z = Math.cos(x2pi) * g2rad;
      this.nextGauss = Math.sin(x2pi) * g2rad;
    }
    return mean + z * stdev;
  }

  /**
   * Get an array filled with random floats in the given range.
   *
   * @param size - The size of the array.
   * @param from - The start of the range.
   * @param to - The end of the range.
   */
  public floatArray(size: number, from = 0, to = 1): number[] {
    return range(size).map(() => this.nextFloat(from, to));
  }

  /**
   Get an array filled with random integers in the given range.
   *
   * @param size - The size of the array.
   * @param from - The start of the range.
   * @param to - The end of the range. Exclusive.
   */
  public intArray(size: number, from = 0, to = 4294967296): number[] {
    return range(size).map(() => this.nextInt(from, to));
  }

  /**
   * Create a new independent generator.
   */
  public spawn() {
    return new Random(this.nextInt());
  }

  private next() {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
