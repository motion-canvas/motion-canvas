import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';
import {tween, easeInOutCubic} from '@motion-canvas/core/lib/tweening';
import {Vector2} from '@motion-canvas/core/lib/types';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle
      //highlight-start
      ref={circle}
      x={-300}
      y={200}
      width={240}
      height={240}
      fill="#e13238"
    />,
  );
  //highlight-start
  yield* tween(2, value => {
    circle.value.position(
      Vector2.arcLerp(
        new Vector2(-300, 200),
        new Vector2(300, -200),
        easeInOutCubic(value),
      ),
    );
  });
  //highlight-end
});
