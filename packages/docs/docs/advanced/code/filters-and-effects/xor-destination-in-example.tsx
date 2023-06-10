import {Gradient, Img, makeScene2D, Node, Circle} from '@motion-canvas/2d';
import {
  Vector2,
  createRef,
  easeInOutSine,
  linear,
  waitFor,
} from '@motion-canvas/core';

/*
 * This example shows you that you can also nest composite operations.
 * Here we use a source-in to mask out an Image and use the Result to XOR with the
 * MC Icon
 */

// Image by Marek Piwnicki (https://unsplash.com/photos/_4o-1pr2oqU)
const ImageSource =
  'https://images.unsplash.com/photo-1685901088371-f498db7f8c46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=50';

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
  const imageRef = createRef<Img>();

  yield scene.add(
    <Node cache={true}>
      {/** Stencil / Mask Layer. It defines if the Value Layer is visible or not */}
      <Img ref={maskRef} size={250} src="/img/logo_dark.svg" />
      {/** Value Layer (which in itself is generated from a composite operation)  */}
      <Node cache compositeOperation={'xor'}>
        <Circle ref={valueRef} size={0} fill={'white'} />
        <Img
          ref={imageRef}
          width={600}
          rotation={180}
          src={ImageSource}
          compositeOperation={'source-in'}
        />
      </Node>
    </Node>,
  );

  yield maskRef().rotation(360, 4, linear);
  yield imageRef().rotation(-360 + 180, 4, linear);
  yield* valueRef().size(300, 1.5, easeInOutSine);
  yield* waitFor(0.5);
  yield* valueRef().size(0, 1.5, easeInOutSine);
  yield* waitFor(0.5);
});
