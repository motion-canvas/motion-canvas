import {FlagDispatcher, Subscribable} from '../events';
import {DetailedError} from '../utils';

export interface PromiseHandle<T> {
  promise: Promise<T>;
  value: T;
  stack?: string;
  owner?: any;
}

export class DependencyContext<TOwner = void> {
  protected static collectionSet = new Set<DependencyContext<any>>();
  protected static collectionStack: DependencyContext<any>[] = [];
  protected static promises: PromiseHandle<any>[] = [];

  public static collectPromise<T>(promise: Promise<T>): PromiseHandle<T | null>;
  public static collectPromise<T>(
    promise: Promise<T>,
    initialValue: T,
  ): PromiseHandle<T>;
  public static collectPromise<T>(
    promise: Promise<T>,
    initialValue: T | null = null,
  ): PromiseHandle<T | null> {
    const handle: PromiseHandle<T | null> = {
      promise,
      value: initialValue,
      stack: this.collectionStack[0]?.stack,
    };

    const context = this.collectionStack.at(-2);
    if (context) {
      handle.owner = context.owner;
    }
    promise.then(value => {
      handle.value = value;
      context?.markDirty();
    });

    this.promises.push(handle);
    return handle;
  }

  public static consumePromises(): PromiseHandle<any>[] {
    const result = this.promises;
    this.promises = [];
    return result;
  }

  protected readonly invokable: any;

  protected dependencies = new Set<Subscribable<void>>();
  protected event = new FlagDispatcher();
  protected stack: string | undefined;
  protected markDirty = () => this.event.raise();

  public constructor(protected readonly owner: TOwner) {
    this.invokable = this.invoke.bind(this);
  }

  protected invoke() {
    // do nothing
  }

  protected startCollecting() {
    if (DependencyContext.collectionSet.has(this)) {
      throw new DetailedError(
        'A circular dependency occurred between signals.',
        `This can happen when signals reference each other in a loop.
        Try using the attached stack trace to locate said loop.`,
      );
    }

    this.stack = new Error().stack;
    DependencyContext.collectionSet.add(this);
    DependencyContext.collectionStack.push(this);
  }

  protected finishCollecting() {
    this.stack = undefined;
    DependencyContext.collectionSet.delete(this);
    if (DependencyContext.collectionStack.pop() !== this) {
      throw new Error('collectStart/collectEnd was called out of order.');
    }
  }

  protected collect() {
    const signal = DependencyContext.collectionStack.at(-1);
    if (signal) {
      signal.dependencies.add(this.event.subscribable);
      this.event.subscribe(signal.markDirty);
    }
  }
}
