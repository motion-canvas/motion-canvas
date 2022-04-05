import {GeneratorHelper} from '../helpers';

export class Thread {
  public children: Thread[] = [];
  public value: any;
  private parent: Thread = null;

  public get canceled(): boolean {
    return this._canceled || (this.parent?.canceled ?? false);
  }

  private _canceled: boolean = false;

  public constructor(public readonly runner: Generator) {}

  public next(): IteratorResult<unknown> {
    const result = this.runner.next(this.value);
    this.value = null;
    return result;
  }

  public add(child: Thread) {
    child.cancel();
    child.parent = this;
    child._canceled = false;
    this.children.push(child);

    if (!Object.getPrototypeOf(child.runner).threadable) {
      console.warn('Non-threadable task: ', child.runner);
      GeneratorHelper.makeThreadable(
        child.runner,
        `non-threadable ${this.children.length}`,
      );
    }
  }

  public cancel() {
    if (!this.parent) return;
    this.parent.children = this.parent.children.filter(child => child !== this);
    this.parent = null;
    this._canceled = true;
  }
}
