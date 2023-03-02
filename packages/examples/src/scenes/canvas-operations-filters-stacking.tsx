import {makeScene2D} from '@motion-canvas/2d';
import {AnimatedMotionCanvasIcon} from '../components/AnimatedMotionCanvasIcon';
import {createSignal} from '@motion-canvas/core/lib/signals';
import {linear} from '@motion-canvas/core/lib/tweening';
import {contrast, saturate} from '@motion-canvas/2d/lib/partials';
import {
  Circle,
  Grid,
  Layout,
  Rect,
  Txt,
  TxtProps,
} from '@motion-canvas/2d/lib/components';
import {CodeBlock} from '@motion-canvas/2d/lib/components/CodeBlock';

export default makeScene2D(function* (scene) {
  const t = createSignal(0);
  scene.add(<Rect size={5000} fill={'#111'} />);

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

  const commonTxtValues: Partial<TxtProps> = {
    fontFamily: 'monospace',
    fill: 'white',
    fontSize: 40,
  };
  const commonTxtValuesSmall: Partial<TxtProps> = {
    fontFamily: 'monospace',
    fontSize: 35,
    fontWeight: 600,
  };

  const saturateValue = createSignal(1);
  const contrastValue = createSignal(1);

  scene.add(
    <Layout position={[-600, -200]}>
      <AnimatedMotionCanvasIcon
        filters={[saturate(saturateValue), contrast(contrastValue)]}
        timePassed={t}
      />
      <CodeBlock
        fontSize={30}
        lineHeight={40}
        y={350}
        language="tsx"
        code={`<AnimatedMotionCanvasIcon\n  filters={[\n    saturation(        ),\n    contrast(        )\n  ]}\n/>`}
      />
      <Txt
        {...commonTxtValuesSmall}
        position={[120, 325]}
        fill={'#ffa'}
        text={() => createTextValue(saturateValue(), 1, 2)}
      />
      <Txt
        {...commonTxtValuesSmall}
        position={[80, 370]}
        fill={'#aff'}
        text={() => createTextValue(contrastValue(), 1, 2)}
      />
    </Layout>,
  );

  scene.add(
    <Layout position={[600, -200]}>
      <AnimatedMotionCanvasIcon
        filters={[contrast(contrastValue), saturate(saturateValue)]}
        timePassed={t}
      />
      <CodeBlock
        fontSize={30}
        lineHeight={40}
        y={350}
        language="tsx"
        code={`<AnimatedMotionCanvasIcon\n  filters={[\n    contrast(        ),\n    saturation(        )\n  ]}\n/>`}
      />
      <Txt
        {...commonTxtValuesSmall}
        position={[80, 325]}
        fill={'#aff'}
        text={() => createTextValue(contrastValue(), 1, 2)}
      />
      <Txt
        {...commonTxtValuesSmall}
        position={[120, 370]}
        fill={'#ffa'}
        text={() => createTextValue(saturateValue(), 1, 2)}
      />
    </Layout>,
  );

  scene.add(
    <Layout y={-100}>
      <Grid size={400} stroke={'gray'} lineWidth={1} spacing={100} />
      <Grid size={400} stroke={'#333'} lineWidth={1} spacing={50} />
      <Rect width={400} height={400} stroke={'gray'} lineWidth={5} />
      <Txt
        {...commonTxtValues}
        text={'saturation'}
        rotation={-90}
        x={-250}
        fill={'#ffa'}
      />
      <Txt {...commonTxtValues} text={'contrast'} y={250} fill={'#aff'} />
      <Txt {...commonTxtValues} text={'1'} position={[-200, 250]} />
      <Txt {...commonTxtValues} text={'1'} position={[-250, 200]} />
      <Txt {...commonTxtValues} text={'5'} position={[-250, -200]} />
      <Txt {...commonTxtValues} text={'5'} position={[200, 250]} />
      <Circle
        x={() => -200 + (contrastValue() - 1) * 100}
        y={() => 200 - (saturateValue() - 1) * 100}
        fill={'white'}
        size={20}
      />
    </Layout>,
  );

  yield t(2, 8, linear);
  yield* saturateValue(5, 2);
  yield* contrastValue(5, 2);
  yield* saturateValue(1, 2);
  yield* contrastValue(1, 2);
});
