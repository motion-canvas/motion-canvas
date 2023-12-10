import {
  Circle,
  Grid,
  Layout,
  Rect,
  Txt,
  contrast,
  makeScene2D,
  saturate,
} from '@motion-canvas/2d';
import {createSignal, linear, map, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fontFamily('monospace').fontSize(20).fill('#141414');
  view.add(<Rect size={5000} fill={'#111'} />);

  const t = createSignal(0);
  const saturateValue = createSignal(1);
  const contrastValue = createSignal(1);

  view.add(
    // Left Segment
    <Layout x={-300} direction={'column'} alignItems={'center'} gap={20} layout>
      <Circle
        size={150}
        fill={'#99c47a'}
        filters={[saturate(saturateValue), contrast(contrastValue)]}
      />
      <Layout direction={'row'} gap={20}>
        <Txt fill={'#ffa'}>saturation</Txt>
        <Txt fill={'#aff'}>constrast</Txt>
      </Layout>
    </Layout>,
  );

  // Right Segment
  yield view.add(
    <Layout x={300} direction={'column'} alignItems={'center'} gap={20} layout>
      <Circle
        size={150}
        fill={'#99c47a'}
        filters={[contrast(contrastValue), saturate(saturateValue)]}
      />
      <Layout direction={'row'} gap={20}>
        <Txt fill={'#aff'}>constrast</Txt>
        <Txt fill={'#ffa'}>saturation</Txt>
      </Layout>
    </Layout>,
  );

  // Center Segment
  view.add(
    <Layout y={-10}>
      <Grid size={200} stroke={'gray'} lineWidth={1} spacing={40} />
      <Grid size={200} stroke={'#333'} lineWidth={1} spacing={20} />
      <Rect size={200} stroke={'gray'} lineWidth={2} />
      <Txt
        fill={'white'}
        text={'saturation'}
        rotation={-90}
        x={-115}
        fill={'#ffa'}
      />
      <Txt fill={'white'} text={'contrast'} y={115} fill={'#aff'} />
      <Txt fill={'white'} text={'1'} position={[-115, 100]} />
      <Txt fill={'white'} text={'1'} position={[-100, 115]} />
      <Txt fill={'white'} text={'5'} position={[-115, -90]} />
      <Txt fill={'white'} text={'5'} position={[100, 115]} />
      <Circle
        x={() => map(-150, -100, contrastValue())}
        y={() => map(150, 100, saturateValue())}
        fill={'white'}
        size={20}
      />
    </Layout>,
  );

  yield t(2, 8, linear);
  yield* saturateValue(5, 2);
  yield* contrastValue(5, 2);
  yield* waitFor(1);
  yield* saturateValue(1, 2);
  yield* contrastValue(1, 2);
});
