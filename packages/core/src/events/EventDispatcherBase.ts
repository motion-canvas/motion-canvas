export interface EventHandler<T> {
  (value: T): any;
}

/**
 * A base for dispatching {@link Subscribable}s.
 *
 * @typeParam TValue - The type of the argument passed to subscribers.
 * @typeParam THandler - The type of the callback function.
 */
export abstract class EventDispatcherBase<
  TValue,
  THandler extends EventHandler<TValue> = EventHandler<TValue>,
> {
  public readonly subscribable: Subscribable<TValue, THandler> =
    new Subscribable(this);

  private subscribers = new Set<THandler>();

  /**
   * {@inheritDoc Subscribable.subscribe}
   */
  public subscribe(handler: THandler) {
    this.subscribers.add(handler);
    return () => this.unsubscribe(handler);
  }

  /**
   * {@inheritDoc Subscribable.unsubscribe}
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
 * @remarks
 * External classes can use it to subscribe to an event without being able to
 * dispatch it.
 *
 * @typeParam TValue - The type of the argument passed to subscribers.
 * @typeParam THandler - The type of the callback function.
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
   * @param handler - The handler to invoke when the event occurs.
   *
   * @returns A callback function that cancels the subscription.
   */
  public subscribe(handler: THandler) {
    return this.dispatcher.subscribe(handler);
  }

  /**
   * Unsubscribe from the event.
   *
   * @param handler - The handler to unsubscribe.
   */
  public unsubscribe(handler: THandler) {
    this.dispatcher.unsubscribe(handler);
  }
}
