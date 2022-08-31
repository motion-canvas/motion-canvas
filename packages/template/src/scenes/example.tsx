import {makeKonvaScene} from '@motion-canvas/legacy/lib/scenes';
import {waitFor, waitUntil} from '@motion-canvas/core/lib/flow';
import {useRef} from '@motion-canvas/core/lib/utils';
import {Circle} from 'konva/lib/shapes/Circle';

export default makeKonvaScene(function* (view) {
  const circle = useRef<Circle>();

  view.add(
    <Circle ref={circle} width={320} height={320} fill={'lightseagreen'} />,
  );

  yield* waitUntil('circle');
  yield* circle.value.scale({x: 2, y: 2}, 2);

  yield* waitFor(5);
});
