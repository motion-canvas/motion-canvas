import {makeScene2D} from '@motion-canvas/2d';
import {AnimatedMotionCanvasIcon} from '../components/AnimatedMotionCanvasIcon';
import {createComputed, createSignal} from '@motion-canvas/core/lib/signals';
import {linear} from '@motion-canvas/core/lib/tweening';
import {blur, hue, invert, sepia} from '@motion-canvas/2d/lib/partials';
import {Layout, Rect, Txt} from '@motion-canvas/2d/lib/components';
import {CodeBlock} from '@motion-canvas/2d/lib/components/CodeBlock';

export default makeScene2D(function* (scene) {
  const t = createSignal(0);
  scene.add(<Rect size={5000} fill={'#111'} />);
  const fontSize = 30;
  const lineHeight = 40;
  // See [Desmos](https://www.desmos.com/calculator/z9fafnej4k) for Mapping
  const animationValue = createComputed(
    () => 0.5 - Math.cos(t() * Math.PI) / 2,
  );

  const createTextValue = (val: number, leftCount = 1, rightCount = 2) => {
    const value = String(Math.round(val * 100) / 100);

    let [left, right] = value.split('.');
    if (!right) {
      right = '';
    }

    left = left.padStart(leftCount).substring(left.length - leftCount);

    if (rightCount === 0) {
      return left;
    }

    right = right.padEnd(rightCount, '0').substring(0, rightCount);
    return `${left}.${right}`;
  };

  const makeInsertedText = (text: () => string, xOffset = 0) => (
    <Txt
      marginLeft={340 + xOffset}
      marginTop={-80}
      fontSize={30}
      fill={'#faa'}
      fontFamily={'monospace'}
      text={text}
    />
  );

  // First Row
  scene.add(
    <Layout layout y={-100} scale={0.7} gap={100} direction={'row'}>
      <Layout layout direction={'column'}>
        <AnimatedMotionCanvasIcon
          filters={() => [blur(animationValue() * 10)]}
          timePassed={t}
        />
        <CodeBlock
          marginTop={600}
          language="tsx"
          fontSize={fontSize}
          lineHeight={lineHeight}
          code={'<AnimatedMotionCanvasIcon\n  filters={[blur(      )]} \n/>'}
        />
        {makeInsertedText(() => createTextValue(animationValue() * 10), -10)}
      </Layout>
      <Layout layout direction={'column'}>
        <AnimatedMotionCanvasIcon
          filters={[sepia(animationValue)]}
          timePassed={t}
        />
        <CodeBlock
          marginTop={600}
          language="tsx"
          fontSize={fontSize}
          lineHeight={lineHeight}
          code={'<AnimatedMotionCanvasIcon\n  filters={[sepia(      )]}\n/>'}
        />
        {makeInsertedText(() => createTextValue(animationValue()))}
      </Layout>

      <Layout layout direction={'column'}>
        <AnimatedMotionCanvasIcon
          filters={() => [hue(t() * 180)]}
          timePassed={t}
        />
        <CodeBlock
          marginTop={600}
          language="tsx"
          fontSize={fontSize}
          lineHeight={lineHeight}
          code={'<AnimatedMotionCanvasIcon\n  filters={[hue(      )]}\n/>'}
        />
        {makeInsertedText(() => createTextValue(180 * t(), 3, 0), -20)}
      </Layout>
      <Layout layout direction={'column'}>
        <AnimatedMotionCanvasIcon
          filters={() => [invert(1 - animationValue())]}
          timePassed={t}
        />
        <CodeBlock
          marginTop={600}
          language="tsx"
          fontSize={fontSize}
          lineHeight={lineHeight}
          code={'<AnimatedMotionCanvasIcon\n  filters={[invert(     )]}\n/>'}
        />
        {makeInsertedText(
          () => createTextValue(1 - animationValue(), 1, 2),
          10,
        )}
      </Layout>
    </Layout>,
  );

  yield* t(2, 6, linear);
});
