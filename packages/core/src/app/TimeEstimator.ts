import {ValueDispatcher} from '../events';
import {clamp} from '../tweening';

/**
 * An estimate of the time remaining until the process is finished.
 */
export interface TimeEstimate {
  /**
   * The completion percentage ranging from `0` to `1`.
   */
  completion: number;
  /**
   * The time passed since the beginning of the process in milliseconds.
   */
  elapsed: number;
  /**
   * The estimated time remaining until the process is finished in milliseconds.
   */
  eta: number;
}

/**
 * Calculates the estimated time remaining until a process is finished.
 */
export class TimeEstimator {
  public get onCompletionChanged() {
    return this.completion.subscribable;
  }
  private readonly completion = new ValueDispatcher(0);
  private startTimestamp = 0;
  private lastUpdateTimestamp = 0;
  private nextCompletion = 0;

  /**
   * Get the current time estimate.
   *
   * @param timestamp - The timestamp to calculate the estimate against.
   *                    Defaults to `performance.now()`.
   */
  public estimate(timestamp = performance.now()): TimeEstimate {
    const elapsed = timestamp - this.startTimestamp;
    const completion = this.completion.current;

    let eta = Infinity;
    if (completion >= 1) {
      eta = 0;
    } else if (completion > 0) {
      const lastUpdateDuration = this.lastUpdateTimestamp - this.startTimestamp;
      eta = lastUpdateDuration / completion - elapsed;
      eta = Math.max(0, eta);
    } else if (this.nextCompletion > 0) {
      eta = elapsed / this.nextCompletion - elapsed;
    }

    return {completion, elapsed, eta};
  }

  /**
   * Update the completion percentage.
   *
   * @param completion - The completion percentage ranging from `0` to `1`.
   * @param timestamp - A timestamp at which the process was updated.
   *                    Defaults to `performance.now()`.
   */
  public update(completion: number, timestamp = performance.now()) {
    this.completion.current = clamp(0, 1, completion);
    this.lastUpdateTimestamp = timestamp;
  }

  /**
   * Reset the estimator.
   *
   * @param nextCompletion - If known, the completion percentage of the next
   *                         update.
   * @param timestamp - A timestamp at which the process started.
   *                    Defaults to `performance.now()`.
   */
  public reset(nextCompletion = 0, timestamp = performance.now()) {
    this.startTimestamp = timestamp;
    this.lastUpdateTimestamp = timestamp;
    this.completion.current = 0;
    this.nextCompletion = nextCompletion;
  }
}
