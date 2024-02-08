import {Rect, Txt} from '@motion-canvas/2d/lib/components';
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {all, waitFor} from '@motion-canvas/core/lib/flow';
import {slideTransition} from '@motion-canvas/core/lib/transitions';
import {createRef} from '@motion-canvas/core/lib/utils';
import {Direction} from '@motion-canvas/core/lib/types';

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
