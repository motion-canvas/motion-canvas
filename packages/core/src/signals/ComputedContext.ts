import {errorToLog, useLogger} from '../utils';
import {DependencyContext} from './DependencyContext';

export interface Computed<TValue> {
  (...args: any[]): TValue;
  context: ComputedContext<TValue>;
}

export class ComputedContext<TValue> extends DependencyContext<any> {
  private last: TValue | undefined;

  public constructor(
    private readonly factory: (...args: any[]) => TValue,
    owner?: any,
  ) {
    super(owner);
    this.markDirty();
  }

  public toSignal(): Computed<TValue> {
    return this.invokable;
  }

  protected override invoke(...args: any[]): TValue {
    if (this.event.isRaised()) {
      this.dependencies.forEach(dep => dep.unsubscribe(this.markDirty));
      this.dependencies.clear();
      this.startCollecting();
      try {
        this.last = this.factory(...args);
      } catch (e: any) {
        useLogger().error({
          ...errorToLog(e),
          inspect: this.owner?.key,
        });
      }
      this.finishCollecting();
    }
    this.event.reset();
    this.collect();

    return this.last!;
  }
}
