import {Gradient, Img, makeScene2D, Node} from '@motion-canvas/2d';
import {Vector2, createRef, linear, waitFor} from '@motion-canvas/core';

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
  const valueRef = createRef<Img>();

  yield scene.add(
    <Node cache={true}>
      {/** Value Layer. Anything from here will be visible if the Stencil Layer allows for it. */}
      <Img ref={valueRef} x={100} src={ImageSource} width={600} />
      {/** Stencil / Mask Layer. It defines if the Value Layer is visible or not */}
      <Img
        ref={maskRef}
        size={250}
        src="/img/logo_dark.svg"
        compositeOperation={'destination-in'}
      />
      {/** !!! Notice how the roles got reversed in comparison to source-in
       * compositeOperation is now on the Mask, and the Value Layer lies above the Mask Layer.
       */}
    </Node>,
  );

  yield maskRef().rotation(360, 4, linear);
  yield* valueRef().x(-100, 1.5);
  yield* waitFor(0.5);
  yield* valueRef().x(100, 1.5);
  yield* waitFor(0.5);
});
