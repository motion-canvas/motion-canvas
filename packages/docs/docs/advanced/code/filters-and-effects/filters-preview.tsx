import {makeScene2D} from '@motion-canvas/2d';
import {createSignal} from '@motion-canvas/core/lib/signals';
import {linear} from '@motion-canvas/core/lib/tweening';
import {Layout, Txt, Img} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';
import {all} from '@motion-canvas/core/lib/flow';

export default makeScene2D(function* (scene) {
  scene.fill('#121212');

  const timePassed = createSignal(0);
  const iconRef = createRef<Img>();
  const currentEffectText = createSignal('');
  yield scene.add(
    <Layout>
      <Img src={'/img/logo_dark.svg'} size={200} x={-200} ref={iconRef} />
      <Txt
        fill={'gray'}
        fontSize={20}
        x={200}
        text={() => 'Current Filter: ' + currentEffectText()}
      />
    </Layout>,
  );

  function* filters() {
    yield currentEffectText('Blur');
    yield* iconRef().filters.blur(20, 1);
    yield* iconRef().filters.blur(0, 1);
    yield currentEffectText('Grayscale');
    yield* iconRef().filters.grayscale(1, 1);
    yield* iconRef().filters.grayscale(0, 1);
    yield currentEffectText('Hue');
    yield* iconRef().filters.hue(360, 2);
    yield currentEffectText('Contrast');
    yield* iconRef().filters.contrast(0, 1);
    yield* iconRef().filters.contrast(1, 1);
  }

  yield* all(timePassed(4, 2 * 4, linear), filters());
});
