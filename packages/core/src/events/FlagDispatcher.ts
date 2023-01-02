import {
  EventDispatcherBase,
  EventHandler,
  Subscribable,
} from './EventDispatcherBase';

/**
 * Dispatches a {@link SubscribableFlagEvent}.
 *
 * @remarks
 * Subscribers are notified only when the flag is set.
 * Subsequent calls to {@link raise} don't trigger anything.
 * Any handlers added while the flag is raised are immediately invoked.
 *
 * Resetting the flag doesn't notify the subscribers, but raising it again does.
 *
 * @example
 * ```ts
 * class Example {
 *   // expose the event to external classes
 *   public get onChanged {
 *     return this.flag.subscribable;
 *   }
 *   // create a private dispatcher
 *   private flag = new FlagDispatcher();
 *
 *   private dispatchExample() {
 *     // setting the flag will notify all subscribers
 *     this.flag.raise();
 *   }
 * }
 * ```
 */
export class FlagDispatcher extends EventDispatcherBase<void> {
  private value = false;

  /**
   * Notify all current and future subscribers.
   */
  public raise() {
    if (!this.value) {
      this.value = true;
      this.notifySubscribers();
    }
  }

  /**
   * Stop notifying future subscribers.
   */
  public reset() {
    this.value = false;
  }

  /**
   * Are subscribers being notified?
   */
  public isRaised() {
    return this.value;
  }

  public subscribe(handler: EventHandler<void>) {
    const unsubscribe = super.subscribe(handler);
    if (this.value) {
      handler();
    }
    return unsubscribe;
  }
}

/**
 * Provides safe access to the public interface of {@link FlagDispatcher}.
 *
 * @remarks
 * External classes can use it to subscribe to an event without being able to
 * dispatch it.
 */
export type SubscribableFlagEvent = Subscribable<void>;
