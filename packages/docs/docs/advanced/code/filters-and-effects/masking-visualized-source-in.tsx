import {
  Gradient,
  Img,
  Layout,
  Rect,
  makeScene2D,
  Node,
  Txt,
  Grid,
} from '@motion-canvas/2d';
import {
  Vector2,
  all,
  createRef,
  createSignal,
  waitFor,
} from '@motion-canvas/core';

const ImageSource =
  'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=50';

export default makeScene2D(function* (scene) {
  scene.fill(
    new Gradient({
      type: 'linear',
      from: new Vector2(400, 100),
      to: new Vector2(-400, -100),
      stops: [
        {offset: 0, color: '#a66'},
        {offset: 1, color: '#66a'},
      ],
    }),
  );

  const valuePosition = createSignal(new Vector2(100, -30));
  const maskPosition = createSignal(new Vector2(-100, -30));

  const maskLayerRotation = createSignal(0);
  const valueLayerRotation = createSignal(0);

  const fakeMaskLayerGroup = createRef<Node>();
  const fakeValueLayerGroup = createRef<Node>();

  // First show fake a Mask Layer. Funnily enough, this also makes use of masking!
  yield scene.add(
    <Node ref={fakeMaskLayerGroup} opacity={0} cache>
      <Img
        src="/img/logo_dark.svg"
        size={200}
        position={maskPosition}
        rotation={maskLayerRotation}
      />
      <Grid
        compositeOperation={'source-in'}
        stroke={'white'}
        width={1000}
        height={400}
        spacing={5}
        lineWidth={1}
      />
    </Node>,
  );
  yield scene.add(
    <Node ref={fakeValueLayerGroup} opacity={0} cache>
      {/* 
                We do not specifically need to use the Image here, a simple Rectangle would be enough. 
                It is however convenient because we get the correct aspect ratio.
            */}
      <Img
        src={ImageSource}
        width={200}
        position={valuePosition}
        rotation={valueLayerRotation}
      />
      <Grid
        compositeOperation={'source-in'}
        stroke={'#ff0'}
        width={1000}
        rotation={45}
        height={1000}
        spacing={5}
        lineWidth={1}
      />
    </Node>,
  );

  // Legend (Bottom Center)
  yield scene.add(
    <Rect fill={'#111111A0'} width={600} height={100} y={130} radius={10} />,
  );
  yield scene.add(
    <Layout layout direction={'row'} gap={20} y={100}>
      <Layout gap={5} alignItems={'center'}>
        <Grid
          stroke={'white'}
          width={18}
          height={18}
          spacing={5}
          lineWidth={1}
        />
        <Txt fill={'white'} fontSize={20}>
          Hidden Stencil / Mask Layer
        </Txt>
      </Layout>
      <Layout gap={5} alignItems={'center'}>
        <Grid
          stroke={'#ff0'}
          rotation={45}
          width={18}
          height={18}
          spacing={5}
          lineWidth={1}
        />
        <Txt fill={'white'} fontSize={20}>
          Hidden Value Layer
        </Txt>
      </Layout>
    </Layout>,
  );
  yield* all(
    fakeMaskLayerGroup().opacity(1, 1),
    fakeValueLayerGroup().opacity(1, 1),
  );
  // Here comes the *actual* value and stencil mask. Because it got added last it will be ontop of the "fake" layers.
  yield scene.add(
    <Node cache={true}>
      {/** Stencil / Mask Layer. It defines if the Value Layer is visible or not */}
      <Img
        src="/img/logo_dark.svg"
        size={200}
        position={maskPosition}
        rotation={maskLayerRotation}
      />
      {/** Value Layer. Anything from here will be visible if the Stencil Layer allows for it. */}
      <Img
        src={ImageSource}
        width={200}
        position={valuePosition}
        rotation={valueLayerRotation}
        compositeOperation={'source-in'}
      />
    </Node>,
  );

  // Visible Loop
  yield* all(
    maskPosition(new Vector2(0, -30), 2),
    valuePosition(new Vector2(0, -30), 2),
  );
  yield* maskLayerRotation(360, 2);
  yield* valueLayerRotation(-360, 2);
  yield* waitFor(1);
  yield* all(
    maskPosition(new Vector2(-100, -30), 2),
    valuePosition(new Vector2(100, -30), 2),
  );
  yield* all(
    fakeMaskLayerGroup().opacity(0, 1),
    fakeValueLayerGroup().opacity(0, 1),
  );

  // Hidden Loop
  yield* all(
    maskPosition(new Vector2(0, -30), 2),
    valuePosition(new Vector2(0, -30), 2),
  );
  yield* maskLayerRotation(2 * 360, 2);
  yield* valueLayerRotation(2 * -360, 2);
  yield* waitFor(1);
  yield* all(
    maskPosition(new Vector2(-100, -30), 2),
    valuePosition(new Vector2(100, -30), 2),
  );
});
