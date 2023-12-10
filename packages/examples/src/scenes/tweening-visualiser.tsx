import {
  Circle,
  Grid,
  Layout,
  Line,
  Node,
  Rect,
  Txt,
  makeScene2D,
} from '@motion-canvas/2d';
import {
  all,
  createSignal,
  easeInOutBounce,
  linear,
  waitFor,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Signals
  const time = createSignal(0);
  const value = createSignal(0);

  // Animation time
  const TIME = 3.5;

  view.add(
    <Node y={-30}>
      {/* Grid and animated point */}
      <Grid size={700} stroke={'#444'} lineWidth={3} spacing={100}>
        <Rect
          layout
          size={100}
          offset={[-1, 1]}
          x={() => time() * 500 - 300}
          y={() => value() * -500 + 300}
        >
          <Circle size={60} fill={'#C22929'} margin={20}></Circle>
        </Rect>
      </Grid>

      {/* Vertical */}
      <Node position={[-400, -400]}>
        {/* Axis */}
        <Line
          lineWidth={4}
          points={[
            [0, 750],
            [0, 35],
          ]}
          stroke={'#DDD'}
          lineCap={'round'}
          endArrow
          arrowSize={15}
        ></Line>

        {/* Tracker */}
        <Layout y={() => value() * -500 + 650}>
          <Txt
            fill={'#DDD'}
            text={() => value().toFixed(2).toString()}
            fontWeight={300}
            fontSize={30}
            x={-55}
            y={3}
          ></Txt>
          <Circle size={30} fill={'#DDD'}></Circle>
        </Layout>

        {/* Label */}
        <Txt
          y={400}
          x={-160}
          fontWeight={400}
          fontSize={50}
          padding={20}
          fontFamily={'Candara'}
          fill={'#DDD'}
          text={'VALUE'}
        ></Txt>
      </Node>

      {/* Horizontal */}
      <Node position={[-400, -400]}>
        {/* Axis */}
        <Line
          lineWidth={4}
          points={[
            [50, 800],
            [765, 800],
          ]}
          stroke={'#DDD'}
          lineCap={'round'}
          endArrow
          arrowSize={15}
        ></Line>

        {/* Tracker */}
        <Layout y={800} x={() => time() * 500 + 150}>
          <Circle size={30} fill={'#DDD'}></Circle>
          <Txt
            fill={'#DDD'}
            text={() => (time() * TIME).toFixed(2).toString()}
            fontWeight={300}
            fontSize={30}
            y={50}
          ></Txt>
        </Layout>

        {/* Label */}
        <Txt
          y={900}
          x={400}
          fontWeight={400}
          fontSize={50}
          padding={20}
          fontFamily={'Candara'}
          fill={'#DDD'}
          text={'TIME'}
        ></Txt>
      </Node>
    </Node>,
  );

  yield* waitFor(0.5);

  yield* all(time(1, TIME, linear), value(1, TIME, easeInOutBounce));

  yield* waitFor(0.8);
});
