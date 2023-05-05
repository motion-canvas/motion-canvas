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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'motion-canvas-player': MotionCanvasPlayerProps & ComponentProps<'div'>;
    }
  }
}

export interface AnimationPlayerProps {
  banner?: boolean;
  name: string;
  link?: string;
}

export default function AnimationPlayer({
  name,
  banner,
  link,
}: AnimationPlayerProps) {
  return (
    <div className={clsx(styles.container, banner && styles.banner)}>
      <motion-canvas-player
        class={styles.player}
        src={`/examples/${name}.js`}
        auto={banner}
      />
      <AnimationLink name={link || name} />
    </div>
  );
}
