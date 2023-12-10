import {Img, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, linear} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#141414');

  const timePassed = createSignal(0);
  const iconRef = createRef<Img>();
  const currentEffectText = createSignal('');
  yield view.add(
    <>
      <Img src={'/img/logo_dark.svg'} size={200} x={-200} ref={iconRef} />
      <Txt
        fill={'rgba(255, 255, 255, 0.6)'}
        fontSize={20}
        x={200}
        text={() => 'Current Filter: ' + currentEffectText()}
      />
    </>,
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
