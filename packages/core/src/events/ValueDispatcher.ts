import {
  EventDispatcherBase,
  EventHandler,
  Subscribable,
} from './EventDispatcherBase';

/**
 * Dispatches a {@link SubscribableValueEvent}
 *
 * @remarks
 * Changing the value stored by a value dispatcher will immediately notify all
 * its subscribers.
 *
 * @example
 * ```ts
 * class Example {
 *   // expose the event to external classes
 *   public get onValueChanged {
 *     return this.value.subscribable;
 *   }
 *   // create a private dispatcher
 *   private value = new ValueDispatcher(0);
 *
 *   private changingValueExample() {
 *     // changing the value will notify all subscribers.
 *     this.value.current = 7;
 *   }
 * }
 * ```
 *
 * @typeParam T - The type of the value passed to subscribers.
 */
export class ValueDispatcher<T> extends EventDispatcherBase<T> {
  public readonly subscribable: SubscribableValueEvent<T> =
    new SubscribableValueEvent(this);

  /**
   * {@inheritDoc SubscribableValueEvent.current}
   */
  public get current() {
    return this.value;
  }

  /**
   * Set the current value of this dispatcher.
   *
   * @remarks
   * Setting the value will immediately notify all subscribers.
   *
   * @param value - The new value.
   */
  public set current(value: T) {
    this.value = value;
    this.notifySubscribers(value);
  }

  /**
   * @param value - The initial value.
   */
  public constructor(private value: T) {
    super();
  }

  /**
   * {@inheritDoc SubscribableValueEvent.subscribe}
   */
  public subscribe(handler: EventHandler<T>, dispatchImmediately = true) {
    const unsubscribe = super.subscribe(handler);
    if (dispatchImmediately) {
      handler(this.value);
    }
    return unsubscribe;
  }
}

/**
 * Provides safe access to the public interface of {@link ValueDispatcher}.
 *
 * @remarks
 * External classes can use it to subscribe to an event without being able to
 * dispatch it.
 *
 * @typeParam T - The type of the value passed to subscribers.
 */
export class SubscribableValueEvent<T> extends Subscribable<
  T,
  EventHandler<T>
> {
  /**
   * Get the most recent value of this dispatcher.
   */
  public get current() {
    return (<ValueDispatcher<T>>this.dispatcher).current;
  }

  /**
   * Subscribe to the event.
   *
   * Subscribing will immediately invoke the handler with the most recent value.
   *
   * @param handler - The handler to invoke when the event occurs.
   * @param dispatchImmediately - Whether the handler should be immediately
   *                              invoked with the most recent value.
   *
   * @returns Callback function that cancels the subscription.
   */
  public subscribe(
    handler: EventHandler<T>,
    dispatchImmediately = true,
  ): () => void {
    return (<ValueDispatcher<T>>this.dispatcher).subscribe(
      handler,
      dispatchImmediately,
    );
  }
}
