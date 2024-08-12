import {DependencyContext} from './DependencyContext';

export class EffectContext extends DependencyContext {
  public constructor(private readonly callback: () => void) {
    super();
    this.event.subscribe(this.update);
    this.markDirty();
  }

  private update = () => {
    this.clearDependencies();
    this.startCollecting();
    this.callback();
    this.finishCollecting();
    this.event.reset();
  };
}
