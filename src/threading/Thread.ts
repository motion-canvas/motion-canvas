import {GeneratorHelper} from '../helpers';
import {ThreadGenerator} from './ThreadGenerator';
import {setThread, useProject} from '../utils';

/**
 * A class representing an individual thread.
 *
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
   * Used by {@link waitFor} and other time-based functions to properly support
   * durations shorter than one frame.
   */
  public time = 0;

  /**
   * Check if this thread or any of its ancestors has been canceled.
   */
  public get canceled(): boolean {
    return this.isCanceled || (this.parent?.canceled ?? false);
  }

  public parent: Thread = null;
  private isCanceled = false;
  private readonly frameDuration: number;

  public constructor(
    /**
     * The generator wrapped by this thread.
     */
    public readonly runner: ThreadGenerator,
  ) {
    const project = useProject();
    this.frameDuration = project.framesToSeconds(1);
    this.time = project.time;
  }

  /**
   * Progress the wrapped generator once.
   */
  public next() {
    setThread(this);
    const result = this.runner.next(this.value);
    this.value = null;
    return result;
  }

  /**
   * Prepare the thread for the next update cycle.
   */
  public update() {
    this.time += useProject().framesToSeconds(1);
    this.children = this.children.filter(child => !child.canceled);
  }

  public add(child: Thread) {
    child.cancel();
    child.parent = this;
    child.isCanceled = false;
    child.time = this.time;
    this.children.push(child);

    if (!Object.getPrototypeOf(child.runner).threadable) {
      console.warn('Non-threadable task: ', child.runner);
      GeneratorHelper.makeThreadable(
        child.runner,
        `non-threadable ${this.children.length}`,
      );
    }
  }

  public cancel() {
    this.isCanceled = true;
    this.parent = null;
  }
}
