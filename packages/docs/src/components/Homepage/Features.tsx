import React from 'react';
import styles from './styles.module.css';

import Link from '@docusaurus/Link';
import YouTubeVideo from '@site/src/components/YouTubeVideo';
import CodeBlock from '@theme/CodeBlock';

import UI from '@site/static/img/ui.svg';

const CodeSample = `export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  view.add(
    <Circle 
      ref={circle} 
      width={320} 
      height={320} 
      fill={'blue'} 
    />
  );
  
  yield* circle().scale(2, 0.3);
  yield* waitUntil('event');
  yield* all(
    circle().scale(1, 0.3),
    circle().position.y(200, 0.3),
  );
  yield* circle().fill('green', 0.3);
});`;

type FeatureItem = {
  children: JSX.Element | JSX.Element[];
  content: JSX.Element;
};

function Feature({content, children}: FeatureItem) {
  return (
    <div className={styles.feature}>
      <div className={styles.preview}>{content}</div>
      <div className={styles.wrapper}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section>
      <Feature content={<UI />}>
        <h3>
          Best of <b>Both</b> Worlds
        </h3>
        <p>
          Some things are easier with a mouse. Write animations in TypeScript
          with your favorite IDE; Use a web-based editor to sync them with
          audio.
        </p>
        <p>
          Powered by{' '}
          <a href="https://vitejs.dev/" target="_blank">
            Vite
          </a>
          , a real-time preview of your animation automatically updates upon any
          changes.
        </p>
        <p>
          <a
            className="button button--outline button--lg"
            href="/editor/quickstart"
            target="_blank"
          >
            Try the Editor
          </a>
        </p>
      </Feature>
      <Feature content={<CodeBlock language="tsx">{CodeSample}</CodeBlock>}>
        <h3>
          <b>Procedural</b> for a Change
        </h3>
        <p>
          Let the execution of your code define the animation. Write generator
          functions that describe what should happen - step by step.
        </p>
        <p>
          Focus on duration, speed and acceleration instead of hardcoded key
          frames.
        </p>
        <p>
          <Link
            className="button button--outline button--lg"
            to="/docs/quickstart"
          >
            Learn More
          </Link>
        </p>
      </Feature>
      <Feature
        content={
          <YouTubeVideo src="https://www.youtube.com/embed/R6vQ9VmMz2w" />
        }
      >
        <h3>
          <b>Tested</b> in Combat
        </h3>
        <p>
          The road ahead is still long, but you can already use Motion Canvas to
          create production-quality animations.
        </p>
        <p>
          <a
            className="button button--outline button--lg"
            href="https://github.com/motion-canvas/examples"
            target="_blank"
          >
            Video Source Code
          </a>
        </p>
      </Feature>
    </section>
  );
}
