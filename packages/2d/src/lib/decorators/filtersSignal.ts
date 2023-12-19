import {
  Signal,
  SignalContext,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  TimingFunction,
  all,
  deepLerp,
  easeInOutCubic,
  unwrap,
} from '@motion-canvas/core';
import {FILTERS, Filter, FilterName} from '../partials';
import {addInitializer} from './initializers';
import {getPropertyMetaOrCreate} from './signal';

export type FiltersSignal<TOwner> = Signal<
  Filter[],
  Filter[],
  TOwner,
  FiltersSignalContext<TOwner>
> & {
  [K in FilterName]: SimpleSignal<number, TOwner>;
};

export class FiltersSignalContext<TOwner> extends SignalContext<
  Filter[],
  Filter[],
  TOwner
> {
  public constructor(initial: Filter[], owner: TOwner) {
    super(initial, deepLerp, owner);

    for (const filter in FILTERS) {
      const props = FILTERS[filter];
      Object.defineProperty(this.invokable, filter, {
        value: (
          newValue?: SignalValue<number>,
          duration?: number,
          timingFunction: TimingFunction = easeInOutCubic,
        ) => {
          if (newValue === undefined) {
            return (
              this.get()
                ?.find(filter => filter.name === props.name)
                ?.value() ??
              props.default ??
              0
            );
          }

          let instance = this.get()?.find(filter => filter.name === props.name);
          if (!instance) {
            instance = new Filter(props);
            this.set([...this.get(), instance]);
          }

          if (duration === undefined) {
            instance.value(newValue);
            return this.owner;
          }

          return instance.value(newValue, duration, timingFunction);
        },
      });
    }
  }

  public override *tweener(
    value: SignalValue<Filter[]>,
    duration: number,
    timingFunction: TimingFunction,
  ): ThreadGenerator {
    const from = this.get();
    const to = unwrap(value);

    if (areFiltersCompatible(from, to)) {
      yield* all(
        ...from.map((filter, i) =>
          filter.value(to[i].value(), duration, timingFunction),
        ),
      );
      this.set(to);
      return;
    }

    for (const filter of to) {
      filter.value(filter.default);
    }

    const toValues = to.map(filter => filter.value.context.raw());
    const partialDuration =
      from.length > 0 && to.length > 0 ? duration / 2 : duration;
    if (from.length > 0) {
      yield* all(
        ...from.map(filter =>
          filter.value(filter.default, partialDuration, timingFunction),
        ),
      );
    }
    this.set(to);
    if (to.length > 0) {
      yield* all(
        ...to.map((filter, index) =>
          filter.value(toValues[index]!, partialDuration, timingFunction),
        ),
      );
    }
  }
}

export function filtersSignal(): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMetaOrCreate<Filter[]>(target, key);
    addInitializer(target, (instance: any) => {
      instance[key] = new FiltersSignalContext(
        meta.default ?? [],
        instance,
      ).toSignal();
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
