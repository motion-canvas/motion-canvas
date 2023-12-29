import {Circle, Grid, Line, Node, makeScene2D} from '@motion-canvas/2d';
import {Vector2, all, createRef, createSignal} from '@motion-canvas/core';

const RED = '#ff6470';
const GREEN = '#99C47A';
const BLUE = '#68ABDF';

export default makeScene2D(function* (view) {
  const group = createRef<Node>();
  const scale = createSignal(1);

  view.add(
    <Node ref={group} x={-100}>
      <Grid
        width={1920}
        height={1920}
        spacing={() => scale() * 60}
        stroke={'#444'}
        lineWidth={1}
        lineCap="square"
        cache
      />
      <Circle
        width={() => scale() * 120}
        height={() => scale() * 120}
        stroke={BLUE}
        lineWidth={4}
        startAngle={110}
        endAngle={340}
      />
      <Line
        stroke={RED}
        lineWidth={4}
        endArrow
        arrowSize={10}
        points={[Vector2.zero, () => Vector2.right.scale(scale() * 70)]}
      />
      <Line
        stroke={GREEN}
        lineWidth={4}
        endArrow
        arrowSize={10}
        points={[Vector2.zero, () => Vector2.up.scale(scale() * 70)]}
      />
      <Circle width={20} height={20} fill="#fff" />
    </Node>,
  );

  yield* group().position.x(100, 0.8);
  yield* group().rotation(30, 0.8);
  yield* scale(2, 0.8);
  yield* group().position.x(-100, 0.8);
  yield* all(group().rotation(0, 0.8), scale(1, 0.8));
});
