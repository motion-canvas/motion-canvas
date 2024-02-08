import {deepLerp, InterpolationFunction} from '../tweening';
import {SignalContext, SimpleSignal, SignalValue} from '../signals';

export function createSignal<TValue, TOwner = void>(
  initial?: SignalValue<TValue>,
  interpolation: InterpolationFunction<TValue> = deepLerp,
  owner?: TOwner,
): SimpleSignal<TValue, TOwner> {
  return new SignalContext<TValue, TValue, TOwner>(
    initial,
    interpolation,
    owner,
  ).toSignal();
}
