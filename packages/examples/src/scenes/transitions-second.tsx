import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  Direction,
  all,
  createRef,
  slideTransition,
  waitFor,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  const text = createRef<Txt>();

  view.add(
    <Rect
      ref={rect}
      width={'100%'}
      height={'100%'}
      fill={'lightcoral'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt
        ref={text}
        fontSize={160}
        fontWeight={700}
        fill={'#fff'}
        fontFamily={'"JetBrains Mono", monospace'}
      >
        SECOND SCENE
      </Txt>
    </Rect>,
  );

  yield* slideTransition(Direction.Left);

  yield* waitFor(0.4);
  yield* all(
    rect().fill('lightseagreen', 0.6),
    text().text('FIRST SCENE', 0.6),
  );
});
