import {makeScene2D, Rect} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.add(
    <>
      <Rect
        ref={rect}
        width={200}
        height={100}
        rotation={-10}
        fill={'#333333'}
      />
      <Rect
        size={50}
        fill={'#e6a700'}
        rotation={rect().rotation}
        // Try changing "right" to "top"
        right={rect().left}
      />
      <Rect
        size={100}
        fill={'#e13238'}
        rotation={10}
        bottomLeft={rect().bottomRight}
      />
    </>,
  );

  yield* rect().rotation(10, 1).to(-10, 1);
});
