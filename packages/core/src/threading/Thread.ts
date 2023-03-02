import {ThreadGenerator} from './ThreadGenerator';
import {endThread, startThread} from '../utils';
import {createSignal} from '../signals';
import {setTaskName} from './names';

/**
 * A class representing an individual thread.
 *
 * @remarks
 * Thread is a wrapper for a generator that can be executed concurrently.
 *
 * Aside from the main thread, all threads need to have a parent.
 * If a parent finishes execution, all of its child threads are terminated.
 */
export class Thread {
  public children: Thread[] = [];
  /**
   * The next value to be passed to the wrapped generator.
   */
  public value: unknown;

  /**
   * The current time of this thread.
   *
   * @remarks
   * Used by {@link flow.waitFor} and other time-based functions to properly
   * support durations shorter than one frame.
   */
  public readonly time = createSignal(0);

  /**
   * The fixed time of this thread.
   *
   * @remarks
   * Fixed time is a multiple of the frame duration. It can be used to account
   * for the difference between this thread's {@link time} and the time of the
   * current animation frame.
   */
  public get fixed() {
    return this.fixedTime;
  }

  /**
   * Check if this thread or any of its ancestors has been canceled.
   */
  public get canceled(): boolean {
    return this.isCanceled || (this.parent?.canceled ?? false);
  }

  public parent: Thread | null = null;
  private isCanceled = false;
  private fixedTime = 0;

  public constructor(
    /**
     * The generator wrapped by this thread.
     */
    public readonly runner: ThreadGenerator,
  ) {}

  /**
   * Progress the wrapped generator once.
   */
  public next() {
    startThread(this);
    const result = this.runner.next(this.value);
    endThread(this);
    this.value = null;
    return result;
  }

  /**
   * Prepare the thread for the next update cycle.
   *
   * @param dt - The delta time of the next cycle.
   */
  public update(dt: number) {
    this.time(this.time() + dt);
    this.fixedTime += dt;
    this.children = this.children.filter(child => !child.canceled);
  }

  public add(child: Thread) {
    child.cancel();
    child.parent = this;
    child.isCanceled = false;
    child.time(this.time());
    this.children.push(child);

    setTaskName(child.runner, `unknown ${this.children.length}`);
  }

  public cancel() {
    this.isCanceled = true;
    this.parent = null;
  }
}
