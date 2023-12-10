import {Img, Node, makeScene2D} from '@motion-canvas/2d';
import {createRef, linear} from '@motion-canvas/core';

// Image by Marek Piwnicki (https://unsplash.com/photos/_4o-1pr2oqU)
const ImageSource =
  'https://images.unsplash.com/photo-1685901088371-f498db7f8c46';

export default makeScene2D(function* (view) {
  view.fill('#141414');

  const maskRef = createRef<Img>();
  const valueRef = createRef<Img>();

  yield view.add(
    <Node cache>
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
  yield* valueRef().x(-100, 1.5).wait(0.5).to(100, 1.5).wait(0.5);
});
