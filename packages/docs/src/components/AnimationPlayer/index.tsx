import type {MotionCanvasPlayerProps} from '@motion-canvas/player';
import React, {ComponentProps} from 'react';
import styles from './styles.module.css';
import AnimationLink from './AnimationLink';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import clsx from 'clsx';

if (ExecutionEnvironment.canUseDOM) {
  import('@motion-canvas/player');
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'motion-canvas-player': MotionCanvasPlayerProps & ComponentProps<'div'>;
    }
  }
}

export interface AnimationPlayerProps {
  banner?: boolean;
  small?: boolean;
  name: string;
}

export default function AnimationPlayer({
  name,
  banner,
  small,
}: AnimationPlayerProps) {
  return (
    <div
      className={clsx(
        styles.container,
        banner && styles.banner,
        small && styles.small,
      )}
    >
      <motion-canvas-player
        class={styles.player}
        src={`/examples/${name}.js`}
        auto={banner}
      />
      <AnimationLink name={name} />
    </div>
  );
}
