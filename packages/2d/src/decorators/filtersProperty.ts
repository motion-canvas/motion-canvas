import {getPropertyMetaOrCreate, PropertyOwner} from './property';
import {Filter, FilterName, FILTERS} from '../partials';
import {
  createSignal,
  isReactive,
  Signal,
  SignalGenerator,
  SignalValue,
} from '@motion-canvas/core/lib/utils';
import {easeInOutCubic, TimingFunction} from '@motion-canvas/core/lib/tweening';
import {ThreadGenerator} from '@motion-canvas/core/lib/threading';
import {decorate, threadable} from '@motion-canvas/core/lib/decorators';
import {all} from '@motion-canvas/core/lib/flow';
import {addInitializer} from './initializers';

export type FiltersProperty = Signal<Filter[]> & {
  [K in FilterName]: Signal<number>;
};

export function createFiltersProperty<
  TNode extends PropertyOwner<Filter[], Filter[]>,
  TProperty extends string & keyof TNode,
>(
  node: TNode,
  property: TProperty,
  initial: SignalValue<Filter[]> = [],
): FiltersProperty {
  const signal = createSignal(initial, undefined, node);

  const handler = <Signal<Filter[], TNode>>(
    function (
      newValue?: SignalValue<Filter[]>,
      duration?: number,
      timingFunction: TimingFunction = easeInOutCubic,
    ) {
      if (newValue === undefined) {
        return signal();
      }

      if (duration === undefined) {
        return signal(newValue);
      }

      return makeAnimate(timingFunction)(newValue, duration);
    }
  );

  function makeAnimate(
    defaultTimingFunction: TimingFunction,
    before?: ThreadGenerator,
  ) {
    function animate(
      value: SignalValue<Filter[]>,
      duration: number,
      timingFunction = defaultTimingFunction,
    ) {
      const task = <SignalGenerator<Filter[]>>(
        makeTask(value, duration, timingFunction, before)
      );
      task.to = makeAnimate(timingFunction, task);
      return task;
    }

    return animate;
  }

  decorate(<any>makeTask, threadable());
  function* makeTask(
    value: SignalValue<Filter[]>,
    duration: number,
    timingFunction: TimingFunction,
    before?: ThreadGenerator,
  ) {
    if (before) {
      yield* before;
    }

    const from = signal();
    const to = isReactive(value) ? value() : value;

    if (areFiltersCompatible(from, to)) {
      yield* all(
        ...from.map((filter, i) =>
          filter.value(to[i].value(), duration, timingFunction),
        ),
      );
      signal(to);
      return;
    }

    for (const filter of to) {
      filter.value(filter.default);
    }

    const toValues = to.map(filter => filter.value.raw());
    const partialDuration =
      from.length > 0 && to.length > 0 ? duration / 2 : duration;
    if (from.length > 0) {
      yield* all(
        ...from.map(filter =>
          filter.value(filter.default, partialDuration, timingFunction),
        ),
      );
    }
    signal(to);
    if (to.length > 0) {
      yield* all(
        ...to.map((filter, index) =>
          filter.value(toValues[index], partialDuration, timingFunction),
        ),
      );
    }
  }

  Object.defineProperty(handler, 'reset', {
    configurable: true,
    value: signal.reset,
  });

  Object.defineProperty(handler, 'save', {
    configurable: true,
    value: signal.save,
  });

  Object.defineProperty(handler, 'raw', {
    value: signal.raw,
  });

  for (const filter in FILTERS) {
    const props = FILTERS[filter];
    Object.defineProperty(handler, filter, {
      value: (
        newValue?: SignalValue<number>,
        duration?: number,
        timingFunction: TimingFunction = easeInOutCubic,
      ) => {
        if (newValue === undefined) {
          return (
            signal()?.find(filter => filter.name === props.name) ??
            props.default
          );
        }

        let instance = signal()?.find(filter => filter.name === props.name);
        if (!instance) {
          instance = new Filter(props);
          signal([...signal(), instance]);
        }

        if (duration === undefined) {
          instance.value(newValue);
          return node;
        }

        return instance.value(newValue, duration, timingFunction);
      },
    });
  }

  return <FiltersProperty>(<unknown>handler);
}

export function filtersProperty<T>(): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMetaOrCreate<T>(target, key);
    addInitializer(target, (instance: any, context: any) => {
      instance[key] = createFiltersProperty(
        instance,
        <string>key,
        context.defaults[key] ?? meta.default,
      );
    });
  };
}

function areFiltersCompatible(a: Filter[], b: Filter[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].name !== b[i].name) {
      return false;
    }
  }

  return true;
}
