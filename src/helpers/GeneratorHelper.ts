export namespace GeneratorHelper {
  export function makeThreadable(
    task: Generator,
    source: Generator | string,
  ): void {
    const prototype = Object.getPrototypeOf(task);
    if (!prototype.threadable) {
      prototype.threadable = true;
      prototype.name =
        typeof source === 'string'
          ? source
          : Object.getPrototypeOf(source).name;
    }
  }

  export function isThreadable(value: any): boolean {
    return typeof value === 'function' && value.prototype.threadable === true;
  }

  export function getName(task: Generator): string {
    return Object.getPrototypeOf(task).name ?? null;
  }
}
