import {FlagDispatcher, Subscribable} from '../events';
import {DetailedError} from '../utils';
import {Promisable} from '../threading';

export interface PromiseHandle<T> {
  promise: Promise<T>;
  value: T;
  stack?: string;
  owner?: any;
}

export class DependencyContext<TOwner = void>
  implements Promisable<DependencyContext<TOwner>>
{
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
      stack: new Error().stack,
    };

    const context = this.collectionStack.at(-1);
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
  protected markDirty = () => this.event.raise();

  public constructor(protected owner: TOwner) {
    this.invokable = this.invoke.bind(this);

    Object.defineProperty(this.invokable, 'context', {
      value: this,
    });

    Object.defineProperty(this.invokable, 'toPromise', {
      value: this.toPromise.bind(this),
    });
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

    DependencyContext.collectionSet.add(this);
    DependencyContext.collectionStack.push(this);
  }

  protected finishCollecting() {
    DependencyContext.collectionSet.delete(this);
    if (DependencyContext.collectionStack.pop() !== this) {
      throw new Error('collectStart/collectEnd was called out of order.');
    }
  }

  protected clearDependencies() {
    this.dependencies.forEach(dep => dep.unsubscribe(this.markDirty));
    this.dependencies.clear();
  }

  protected collect() {
    const signal = DependencyContext.collectionStack.at(-1);
    if (signal) {
      signal.dependencies.add(this.event.subscribable);
      this.event.subscribe(signal.markDirty);
    }
  }

  public dispose() {
    this.clearDependencies();
    this.owner = null as TOwner;
  }

  public async toPromise(): Promise<this> {
    let promises = DependencyContext.consumePromises();
    do {
      await Promise.all(promises.map(handle => handle.promise));
      this.invokable();
      promises = DependencyContext.consumePromises();
    } while (promises.length > 0);
    return this.invokable;
  }
}
