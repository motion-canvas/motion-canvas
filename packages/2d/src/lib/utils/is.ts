/**
 * Create a predicate that checks if the given object is an instance of the
 * given class.
 *
 * @param klass - The class to check against.
 */
export function is<T>(
  klass: new (...args: any[]) => T,
): (object: any) => object is T {
  return (object): object is T => object instanceof klass;
}
