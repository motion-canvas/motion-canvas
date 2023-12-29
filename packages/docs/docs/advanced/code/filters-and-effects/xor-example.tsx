import {Circle, Img, Node, makeScene2D} from '@motion-canvas/2d';
import {createRef, easeInOutSine, linear} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#141414');

  const maskRef = createRef<Img>();
  const valueRef = createRef<Circle>();

  yield view.add(
    <Node cache>
      {/** Stencil / Mask Layer. It defines if the Value Layer is visible or not */}
      <Img ref={maskRef} size={250} src="/img/logo_dark.svg" />
      {/** Value Layer. Anything from here will be visible if the Stencil Layer allows for it. */}
      <Circle
        ref={valueRef}
        size={0}
        fill={'white'}
        compositeOperation={'xor'}
      />
    </Node>,
  );

  yield maskRef().rotation(360, 4, linear);
  yield* valueRef()
    .size(300, 1.5, easeInOutSine)
    .wait(0.5)
    .to(0, 1.5)
    .wait(0.5);
});
