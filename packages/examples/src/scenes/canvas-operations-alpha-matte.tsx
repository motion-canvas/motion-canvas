import {makeScene2D} from '@motion-canvas/2d';
import {AnimatedMotionCanvasIcon} from '../components/AnimatedMotionCanvasIcon';
import {createSignal} from '@motion-canvas/core/lib/signals';
import {linear} from '@motion-canvas/core/lib/tweening';
import {Gradient} from '@motion-canvas/2d/lib/partials';
import {Img, Layout, Rect, Txt} from '@motion-canvas/2d/lib/components';

import valueImage from '../../assets/federico-bottos-Z3NceSeZqgI-unsplash.jpg';
import {CodeBlock} from '@motion-canvas/2d/lib/components/CodeBlock';

export default makeScene2D(function* (scene) {
  const t = createSignal(0);
  const valueLayerYOffset = createSignal(100);
  yield scene.add(
    <Rect
      width={1920}
      height={1080}
      fill={
        new Gradient({
          from: [-1920 / 2, 0],
          to: [1920 / 2, 0],
          stops: [
            {offset: 0, color: '#a66'},
            {offset: 1, color: '#66a'},
          ],
        })
      }
    />,
  );

  yield scene.add(
    <Layout y={-100} x={-500}>
      <Img y={valueLayerYOffset} scale={0.7} src={valueImage} />
      <AnimatedMotionCanvasIcon y={-10} timePassed={t} />
    </Layout>,
  );

  yield scene.add(
    <Layout cache y={-100}>
      <AnimatedMotionCanvasIcon y={-10} timePassed={t} />
      <Img
        compositeOperation={'source-in'}
        y={valueLayerYOffset}
        scale={0.7}
        src={valueImage}
      />
    </Layout>,
  );

  yield scene.add(
    <Layout cache y={-100} x={+500}>
      <AnimatedMotionCanvasIcon y={-10} timePassed={t} />
      <Img
        compositeOperation={'source-out'}
        y={valueLayerYOffset}
        scale={0.7}
        src={valueImage}
      />
    </Layout>,
  );

  // Add Code Blocks
  scene.add(
    <Rect fill={'#000000dd'} y={400} width={1920} height={300}>
      <CodeBlock
        fontSize={25}
        lineHeight={40}
        x={-600}
        language="tsx"
        code={
          '<Layout>\n  <Img src={...} y={offset}/>\n  <AnimatedMotionCanvasIcon />\n</Layout>'
        }
      />
      <CodeBlock
        fontSize={25}
        lineHeight={40}
        x={0}
        language="tsx"
        code={
          "<Layout>\n  <AnimatedMotionCanvasIcon />\n  <Img src={...} y={offset}\n    compositeOperation={'source-in'}\n  />\n</Layout>"
        }
      />
      <CodeBlock
        fontSize={25}
        lineHeight={40}
        x={600}
        language="tsx"
        code={
          "<Layout>\n  <AnimatedMotionCanvasIcon />\n  <Img src={...} y={offset}\n    compositeOperation={'source-out'}\n  />\n</Layout>"
        }
      />
      <Txt
        y={100}
        x={750}
        textWrap="pre"
        lineHeight={29}
        text={'Picture by Federico Bottos\n(@landscapeplaces on Unsplash)'}
        fill={'white'}
        fontSize={25}
      />
    </Rect>,
  );

  yield t(2, 4, linear);
  yield* valueLayerYOffset(-100, 2);
  yield* valueLayerYOffset(100, 2);
});
