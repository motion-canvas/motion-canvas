import {
  DescriptionOf,
  ThreadGeneratorFactory,
} from '@motion-canvas/core/lib/scenes';
import {View2D} from './View2D';
import {Scene2D} from './Scene2D';

export function makeScene2D(
  runner: ThreadGeneratorFactory<View2D>,
): DescriptionOf<Scene2D> {
  return {
    klass: Scene2D,
    config: runner,
  };
}
