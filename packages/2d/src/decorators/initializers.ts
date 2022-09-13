const INITIALIZERS = Symbol.for('initializers');

export type Initializer<T> = (instance: T, context: any) => void;

export function addInitializer<T>(target: any, initializer: Initializer<T>) {
  if (!target[INITIALIZERS]) {
    target[INITIALIZERS] = [];
  } else if (
    // if one of the prototypes has initializers
    target[INITIALIZERS] &&
    // and it's not the target object itself
    !Object.prototype.hasOwnProperty.call(target, INITIALIZERS)
  ) {
    const props = [];
    let base = Object.getPrototypeOf(target);
    while (base) {
      if (Object.prototype.hasOwnProperty.call(base, INITIALIZERS)) {
        props.push(...base[INITIALIZERS]);
      }
      base = Object.getPrototypeOf(base);
    }
    target[INITIALIZERS] = props;
  }

  target[INITIALIZERS].push(initializer);
}

export function initialize(target: any, context: any) {
  if (target[INITIALIZERS]) {
    target[INITIALIZERS].forEach((initializer: Initializer<any>) =>
      initializer(target, context),
    );
  }
}
