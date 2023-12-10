import Link from '@docusaurus/Link';
import IconCode from '@site/src/Icon/Code';
import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';

export interface AnimationLinkProps {
  name: string;
}

export default function AnimationLink({name}: AnimationLinkProps) {
  const url = `https://github.com/motion-canvas/motion-canvas/blob/main/packages/examples/src/scenes/${name}.tsx`;
  return (
    <Link to={url} className={clsx('padding--sm', styles.link)}>
      <span>View source code</span>
      <IconCode className={styles.icon} />
    </Link>
  );
}
