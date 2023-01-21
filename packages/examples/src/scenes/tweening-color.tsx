import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';
import {tween, easeInOutCubic} from '@motion-canvas/core/lib/tweening';
import {Color} from '@motion-canvas/core/lib/types';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();

  view.add(
    <Circle
      //highlight-start
      ref={circle}
      width={240}
      height={240}
      fill="#e13238"
    />,
  );
  //highlight-start
  yield* tween(2, value => {
    circle().fill(
      Color.lerp(
        new Color('#e13238'),
        new Color('#e6a700'),
        easeInOutCubic(value),
      ),
    );
  });
  //highlight-end
});
