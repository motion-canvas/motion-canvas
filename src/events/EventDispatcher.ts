import {EventDispatcherBase, Subscribable} from './EventDispatcherBase';

/**
 * Dispatches a {@link SubscribableEvent}.
 *
 * Example:
 * ```ts
 * class Example {
 *   // expose the event to external classes
 *   public get onValueChanged {
 *     return this.value.subscribable;
 *   }
 *   // create a private dispatcher
 *   private value = new EventDispatcher<number>();
 *
 *   private dispatchExample() {
 *     // dispatching will notify all subscribers.
 *     this.value.dispatch(0);
 *   }
 * }
 * ```
 *
 * @template T Type of the value argument to subscribers.
 */
export class EventDispatcher<T> extends EventDispatcherBase<T> {
  public dispatch(value: T) {
    this.notifySubscribers(value);
  }
}

/**
 * Provides safe access to the public interface of {@link EventDispatcher}.
 *
 * External classes can use it to subscribe to an event without being able to
 * dispatch it.
 *
 * @template T Type of the argument passed to subscribers.
 */
export type SubscribableEvent<T> = Subscribable<T>;
