import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {usePlayback} from '../utils';

export interface EveryCallback {
  /**
   * A callback called by {@link EveryTimer} every N seconds.
   *
   * @param tick - The amount of times the timer has ticked.
   */
  (tick: number): void;
}

export interface EveryTimer {
  /**
   * The generator responsible for running this timer.
   */
  runner: ThreadGenerator;
  setInterval(value: number): void;
  setCallback(value: EveryCallback): void;

  /**
   * Wait until the timer ticks.
   */
  sync(): ThreadGenerator;
}

/**
 * Call the given callback every N seconds.
 *
 * @example
 * ```ts
 * const timer = every(2, time => console.log(time));
 * yield timer.runner;
 *
 * // current time: 0s
 * yield* waitFor(5);
 * // current time: 5s
 * yield* timer.sync();
 * // current time: 6s
 * ```
 *
 * @param interval - The interval between subsequent calls.
 * @param callback - The callback to be called.
 */
export function every(interval: number, callback: EveryCallback): EveryTimer {
  let changed = false;
  decorate(everyRunner, threadable('every'));
  function* everyRunner(): ThreadGenerator {
    const project = usePlayback();
    let acc = 0;
    let tick = 0;
    callback(tick);
    changed = true;

    while (true) {
      if (acc >= project.secondsToFrames(interval)) {
        acc = 0;
        tick++;
        callback(tick);
        changed = true;
      } else {
        changed = false;
      }
      acc++;
      yield;
    }
  }

  return {
    runner: everyRunner(),
    setInterval(value) {
      interval = value;
      changed = false;
    },
    setCallback(value) {
      callback = value;
      changed = false;
    },
    *sync() {
      while (!changed) {
        yield;
      }
    },
  };
}
