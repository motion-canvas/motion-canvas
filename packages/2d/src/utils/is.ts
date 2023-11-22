/**
 * Create a predicate that checks if the given object is an instance of the
 * given class.
 *
 * @param klass - The class to check against.
 */
export function is<
  T extends
    // NOTE This is the one specific case where the Function type is actually
    // desired. Hence, the eslint-disable-next-line.
    // eslint-disable-next-line @typescript-eslint/ban-types
    Function,
>(klass: T): (object: any) => object is T {
  return (object): object is T => object instanceof klass;
}
