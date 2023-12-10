import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill={'lightseagreen'}
      layout
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Txt
        fontSize={160}
        fontWeight={700}
        fill={'#fff'}
        fontFamily={'"JetBrains Mono", monospace'}
      >
        FIRST SCENE
      </Txt>
    </Rect>,
  );

  yield* waitFor(1);
});
