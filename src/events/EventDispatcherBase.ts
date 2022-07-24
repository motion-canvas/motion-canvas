export interface EventHandler<T> {
  (value: T): any;
}

/**
 * A base for dispatching {@link Subscribable}s.
 *
 * @template TValue Type of the argument passed to subscribers.
 * @template THandler Type of the callback function.
 */
export abstract class EventDispatcherBase<
  TValue,
  THandler extends EventHandler<TValue> = EventHandler<TValue>,
> {
  public readonly subscribable: Subscribable<TValue, THandler> =
    new Subscribable(this);

  private subscribers = new Set<THandler>();

  /**
   * @inheritDoc SubscribableEvent.subscribe
   */
  public subscribe(handler: THandler) {
    this.subscribers.add(handler);
    return () => this.unsubscribe(handler);
  }

  /**
   * @inheritDoc SubscribableEvent.unsubscribe
   */
  public unsubscribe(handler: THandler) {
    this.subscribers.delete(handler);
  }

  /**
   * Unsubscribe all subscribers from the event.
   */
  public clear() {
    this.subscribers.clear();
  }

  protected notifySubscribers(value: TValue): ReturnType<THandler>[] {
    return [...this.subscribers].map(handler => handler(value));
  }
}

/**
 * Provides safe access to the public interface of {@link EventDispatcherBase}.
 *
 * External classes can use it to subscribe to an event without being able to
 * dispatch it.
 *
 * @template TValue Type of the argument passed to subscribers.
 * @template THandler Type of the callback function.
 */
export class Subscribable<
  TValue,
  THandler extends EventHandler<TValue> = EventHandler<TValue>,
> {
  public constructor(
    protected dispatcher: EventDispatcherBase<TValue, THandler>,
  ) {}

  /**
   * Subscribe to the event.
   *
   * @param handler
   *
   * @return Callback function that cancels the subscription.
   */
  public subscribe(handler: THandler) {
    return this.dispatcher.subscribe(handler);
  }

  /**
   * Unsubscribe from the event.
   *
   * @param handler
   */
  public unsubscribe(handler: THandler) {
    this.dispatcher.unsubscribe(handler);
  }
}
