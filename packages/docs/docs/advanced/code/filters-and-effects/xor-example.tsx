import {Gradient, Img, makeScene2D, Node, Circle} from '@motion-canvas/2d';
import {
  Vector2,
  createRef,
  easeInOutSine,
  linear,
  waitFor,
} from '@motion-canvas/core';

export default makeScene2D(function* (scene) {
  scene.fill(
    new Gradient({
      type: 'linear',
      from: new Vector2(400, 100),
      to: new Vector2(-400, -100),
      stops: [
        {offset: 0, color: '#1daa66'},
        {offset: 1, color: '#c231f7'},
      ],
    }),
  );

  const maskRef = createRef<Img>();
  const valueRef = createRef<Circle>();

  yield scene.add(
    <Node cache={true}>
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
  yield* valueRef().size(300, 1.5, easeInOutSine);
  yield* waitFor(0.5);
  yield* valueRef().size(0, 1.5, easeInOutSine);
  yield* waitFor(0.5);
});
