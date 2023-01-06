import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle} from '@motion-canvas/2d/lib/components';
import {useRef} from '@motion-canvas/core/lib/utils';
import {tween, map, easeInOutCubic} from '@motion-canvas/core/lib/tweening';

export default makeScene2D(function* (view) {
  const circle = useRef<Circle>();

  view.add(
    <Circle
      //highlight-start
      ref={circle}
      x={-300}
      width={240}
      height={240}
      fill="#e13238"
    />,
  );
  //highlight-start
  yield* tween(2, value => {
    circle.value.position.x(map(-300, 300, easeInOutCubic(value)));
  });
  //highlight-end
});
