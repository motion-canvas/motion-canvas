import {EventDispatcherBase, Subscribable} from './EventDispatcherBase';

export interface AsyncEventHandler<T> {
  (value: T): Promise<void>;
}

/**
 * Dispatches an asynchronous {@link SubscribableEvent}.
 *
 * The {@link dispatch} method returns a promise that resolves when all the
 * handlers resolve.
 *
 * Example:
 * ```ts
 * class Example {
 *   // expose the event to external classes
 *   public get onValueChanged {
 *     return this.value.subscribable;
 *   }
 *   // create a private dispatcher
 *   private value = new AsyncEventDispatcher<number>();
 *
 *   private async dispatchExample() {
 *     // dispatching returns a Promise.
 *     await this.value.dispatch(0);
 *   }
 * }
 * ```
 *
 * @template T Type of the argument passed to subscribers.
 */
export class AsyncEventDispatcher<T> extends EventDispatcherBase<
  T,
  AsyncEventHandler<T>
> {
  public async dispatch(value: T): Promise<void> {
    await Promise.all(this.notifySubscribers(value));
  }
}

/**
 * Provides safe access to the public interface of {@link AsyncEventDispatcher}.
 *
 * External classes can use it to subscribe to an event without being able to
 * dispatch it.
 *
 * @template T Type of the argument passed to subscribers.
 */
export type SubscribableAsyncEvent<T> = Subscribable<T, AsyncEventHandler<T>>;
