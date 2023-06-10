import {makeScene2D} from '@motion-canvas/2d';
import {createSignal} from '@motion-canvas/core/lib/signals';
import {linear} from '@motion-canvas/core/lib/tweening';
import {contrast, saturate} from '@motion-canvas/2d/lib/partials';
import {
  Circle,
  Grid,
  Img,
  Layout,
  Rect,
  Txt,
  TxtProps,
} from '@motion-canvas/2d/lib/components';

export default makeScene2D(function* (scene) {
  const t = createSignal(0);
  scene.add(<Rect size={5000} fill={'#111'} />);

  const commonTxtValues: Partial<TxtProps> = {
    fontFamily: 'monospace',
    fill: 'white',
    fontSize: 20,
  };

  const saturateValue = createSignal(1);
  const contrastValue = createSignal(1);

  scene.add(
    // Left Segment
    <Layout x={-300} direction={'column'} layout={true}>
      <Img
        size={200}
        src={'/img/logo_dark.svg'}
        filters={[saturate(saturateValue), contrast(contrastValue)]}
      />
      <Layout direction={'row'} gap={20}>
        <Txt {...commonTxtValues} fill={'#ffa'}>
          saturation
        </Txt>
        <Txt {...commonTxtValues} fill={'#aff'}>
          constrast
        </Txt>
      </Layout>
    </Layout>,
  );

  // Right Segment
  yield scene.add(
    <Layout x={300} direction={'column'} layout={true}>
      <Img
        size={200}
        src={'/img/logo_dark.svg'}
        filters={[contrast(contrastValue), saturate(saturateValue)]}
      />
      <Layout direction={'row'} gap={20}>
        <Txt {...commonTxtValues} fill={'#aff'}>
          constrast
        </Txt>
        <Txt {...commonTxtValues} fill={'#ffa'}>
          saturation
        </Txt>
      </Layout>
    </Layout>,
  );

  // Center Segment
  scene.add(
    <Layout y={-10}>
      <Grid size={200} stroke={'gray'} lineWidth={1} spacing={40} />
      <Grid size={200} stroke={'#333'} lineWidth={1} spacing={20} />
      <Rect size={200} stroke={'gray'} lineWidth={2} />
      <Txt
        {...commonTxtValues}
        text={'saturation'}
        rotation={-90}
        x={-115}
        fill={'#ffa'}
      />
      <Txt {...commonTxtValues} text={'contrast'} y={115} fill={'#aff'} />
      <Txt {...commonTxtValues} text={'1'} position={[-115, 100]} />
      <Txt {...commonTxtValues} text={'1'} position={[-100, 115]} />
      <Txt {...commonTxtValues} text={'5'} position={[-115, -90]} />
      <Txt {...commonTxtValues} text={'5'} position={[100, 115]} />
      <Circle
        x={() => -100 + (contrastValue() - 1) * 50}
        y={() => 100 - (saturateValue() - 1) * 50}
        fill={'white'}
        size={20}
      />
    </Layout>,
  );

  yield t(2, 8, linear);
  yield* saturateValue(5, 2);
  yield* contrastValue(5, 2);
  yield* saturateValue(1, 2);
  yield* contrastValue(1, 2);
});
