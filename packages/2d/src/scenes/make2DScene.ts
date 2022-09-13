import {
  DescriptionOf,
  ThreadGeneratorFactory,
} from '@motion-canvas/core/lib/scenes';
import {TwoDView} from './TwoDView';
import {TwoDScene} from './TwoDScene';

export function make2DScene(
  runner: ThreadGeneratorFactory<TwoDView>,
): DescriptionOf<TwoDScene> {
  return {
    klass: TwoDScene,
    config: runner,
  };
}
