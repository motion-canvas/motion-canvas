export const GeneratorHelper = {
  makeThreadable(task: Generator, source: Generator | string): void {
    const prototype = Object.getPrototypeOf(task);
    if (!prototype.threadable) {
      prototype.threadable = true;
      prototype.name =
        typeof source === 'string'
          ? source
          : Object.getPrototypeOf(source).name;
    }
  },

  isThreadable(value: unknown): boolean {
    return typeof value === 'function' && value.prototype.threadable === true;
  },

  getName(task: Generator): string {
    return Object.getPrototypeOf(task).name ?? null;
  },
};
