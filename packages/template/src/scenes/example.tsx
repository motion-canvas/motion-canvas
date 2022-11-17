import {makeScene2D} from '@motion-canvas/2d';
import {Circle} from '@motion-canvas/2d/lib/components';
import {waitFor, waitUntil} from '@motion-canvas/core/lib/flow';
import {useRef} from '@motion-canvas/core/lib/utils';
import {Vector2} from '@motion-canvas/core/lib/types';

export default makeScene2D(function* (view) {
  const circle = useRef<Circle>();

  view.add(
    <Circle ref={circle} width={320} height={320} fill={'lightseagreen'} />,
  );

  yield* waitUntil('circle');
  yield* circle.value.scale(Vector2.fromScalar(2), 2);

  yield* waitFor(5);
});
