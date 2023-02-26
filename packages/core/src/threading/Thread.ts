import {ThreadGenerator} from './ThreadGenerator';
import {endThread, startThread, usePlayback} from '../utils';
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
   * Check if this thread or any of its ancestors has been canceled.
   */
  public get canceled(): boolean {
    return this.isCanceled || (this.parent?.canceled ?? false);
  }

  public parent: Thread | null = null;
  private isCanceled = false;
  private readonly frameDuration: number;

  public constructor(
    /**
     * The generator wrapped by this thread.
     */
    public readonly runner: ThreadGenerator,
  ) {
    const playback = usePlayback();
    this.frameDuration = playback.framesToSeconds(1);
    this.time(playback.time);
  }

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
   */
  public update() {
    const playback = usePlayback();
    this.time(this.time() + playback.framesToSeconds(1) * playback.speed);
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
