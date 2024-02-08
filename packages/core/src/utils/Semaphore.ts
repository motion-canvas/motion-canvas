/**
 * A simple semaphore implementation with a capacity of 1.
 *
 * @internal
 */
export class Semaphore {
  private resolveCurrent: (() => void) | null = null;
  private current: Promise<void> | null = null;

  public async acquire() {
    while (this.current) {
      await this.current;
    }
    this.current = new Promise(resolve => {
      this.resolveCurrent = resolve;
    });
  }

  public release() {
    this.current = null;
    this.resolveCurrent?.();
    this.resolveCurrent = null;
  }
}
