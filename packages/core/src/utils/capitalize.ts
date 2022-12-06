export function capitalize<T extends string>(value: T): Capitalize<T> {
  return <Capitalize<T>>(value[0].toUpperCase() + value.slice(1));
}
