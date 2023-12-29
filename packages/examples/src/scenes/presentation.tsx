import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  Color,
  all,
  beginSlide,
  cancel,
  createRef,
  createSignal,
  easeInOutCubic,
  loop,
} from '@motion-canvas/core';

const YELLOW = '#FFC66D';
const RED = '#FF6470';
const GREEN = '#99C47A';
const BLUE = '#68ABDF';

export default makeScene2D(function* (view) {
  view.fontFamily(`'JetBrains Mono', monospace`).fontWeight(700).fontSize(256);
  const backdrop = createRef<Rect>();
  const title = createRef<Txt>();
  const rotation = createSignal(0);
  const rotationScale = createSignal(0);

  view.add(
    <Rect
      cache
      ref={backdrop}
      width={'50%'}
      height={'50%'}
      fill={RED}
      radius={40}
      smoothCorners
      rotation={() => rotation() * rotationScale()}
    >
      <Txt
        ref={title}
        scale={0.5}
        compositeOperation={'destination-out'}
        rotation={() => -rotation() * rotationScale()}
      >
        START
      </Txt>
    </Rect>,
  );

  yield* beginSlide('start');
  yield* all(
    backdrop().fill(GREEN, 0.6, easeInOutCubic, Color.createLerp('lab')),
    backdrop().size.x('60%', 0.6),
    title().text('CONTENT', 0.6),
  );

  yield* beginSlide('content');
  const loopTask = yield loop(Infinity, () => rotation(-5, 1).to(5, 1));
  yield* all(
    backdrop().fill(BLUE, 0.6, easeInOutCubic, Color.createLerp('lab')),
    backdrop().size.x('70%', 0.6),
    title().text('ANIMATION', 0.6),
    rotationScale(1, 0.6),
  );

  yield* beginSlide('animation');
  yield* all(
    backdrop().fill(YELLOW, 0.6, easeInOutCubic, Color.createLerp('lab')),
    backdrop().size.x('50%', 0.6),
    title().text('FINISH', 0.6),
    rotationScale(0, 0.6),
  );
  cancel(loopTask);

  yield* beginSlide('finish');
});
