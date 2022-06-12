import {GeneratorHelper} from '../helpers';
import {ThreadGenerator} from './ThreadGenerator';

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
   * Check if this thread or any of its ancestors has been canceled.
   */
  public get canceled(): boolean {
    return this._canceled || (this.parent?.canceled ?? false);
  }

  private parent: Thread = null;
  private _canceled = false;

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
    const result = this.runner.next(this.value);
    this.value = null;
    return result;
  }

  public add(child: Thread) {
    child.cancel();
    child.parent = this;
    child._canceled = false;
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
    if (!this.parent) return;
    this.parent.children = this.parent.children.filter(child => child !== this);
    this.parent = null;
    this._canceled = true;
  }
}
