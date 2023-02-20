import {makeScene2D} from '@motion-canvas/2d';
import {Circle} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';
import {
  PlopSpring,
  SmoothSpring,
  spring,
} from '@motion-canvas/core/lib/tweening';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle
      // highlight-start
      ref={circle}
      x={-400}
      size={240}
      fill={'#e13238'}
    />,
  );

  yield* spring(PlopSpring, -400, 400, 1, value => {
    circle().position.x(value);
  });
  yield* spring(SmoothSpring, 400, -400, value => {
    circle().position.x(value);
  });
});
