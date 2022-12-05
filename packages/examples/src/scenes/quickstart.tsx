import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle} from '@motion-canvas/2d/lib/components';
import {useRef} from '@motion-canvas/core/lib/utils';
import {all} from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* (view) {
  const myCircle = useRef<Circle>();

  view.add(
    <Circle x={-300} ref={myCircle} width={240} height={240} fill="#e13238" />,
  );

  yield* all(
    myCircle.value.position.x(300, 1).to(-300, 1),
    myCircle.value.fill('#e6a700', 1).to('#e13238', 1),
  );
});
