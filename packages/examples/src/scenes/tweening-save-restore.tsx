import {Circle, makeScene2D} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle
      // highlight-start
      ref={circle}
      size={150}
      position={[-300, -300]}
      fill={'#e13238'}
    />,
  );

  circle().save();
  yield* all(circle().position.x(0, 1), circle().scale(1.5, 1));

  circle().save();
  yield* all(circle().position.y(0, 1), circle().scale(0.5, 1));

  circle().save();
  yield* all(circle().position.x(300, 1), circle().scale(1, 1));

  yield* circle().restore(1);
  yield* circle().restore(1);
  yield* circle().restore(1);
});
