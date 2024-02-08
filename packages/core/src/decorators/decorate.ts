export function decorate(fn: Callback, ...decorators: MethodDecorator[]) {
  const target = {[fn.name]: fn};
  const descriptor = Object.getOwnPropertyDescriptor(target, fn.name);
  if (descriptor) {
    for (let i = decorators.length - 1; i >= 0; i--) {
      decorators[i](target, fn.name, descriptor);
    }
  }
}
