export function setTaskName(task: Generator, source: Generator | string): void {
  const prototype = Object.getPrototypeOf(task);
  if (!prototype.threadable) {
    prototype.threadable = true;
    prototype.name = typeof source === 'string' ? source : getTaskName(source);
  }
}

export function getTaskName(task: Generator): string {
  return Object.getPrototypeOf(task).name ?? null;
}
