import {Camera, Circle, Grid, Node, Rect, makeScene2D} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const camera = createRef<Camera>();
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();

  const scene = (
    <Node>
      <Grid stroke={'#fff1'} lineWidth={1} size="100%" spacing={25}>
        <Rect ref={rect} fill={'#e6a700'} size={50} position={[50, -25]} />
        <Circle ref={circle} fill={'#e13238'} size={50} position={[-50, 25]} />
      </Grid>
    </Node>
  );

  view.add(
    <>
      <Camera.Stage
        scene={scene}
        x={-200}
        width={300}
        height={200}
        stroke={'#242424'}
        lineWidth={4}
      />
      <Camera.Stage
        cameraRef={camera}
        scene={scene}
        x={200}
        width={300}
        height={200}
        stroke={'#242424'}
        lineWidth={4}
      />
    </>,
  );

  yield* all(
    camera().centerOn(rect(), 3),
    camera().rotation(180, 3),
    camera().zoom(1.8, 3),
  );
  yield* camera().centerOn(circle(), 2);
  yield* camera().reset(1);
});
