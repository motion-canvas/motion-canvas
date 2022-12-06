import React from 'react';
import styles from './styles.module.css';
import IconCode from '@site/src/Icon/Code';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

export interface AnimationLinkProps {
  name: string;
}

export default function AnimationLink({name}: AnimationLinkProps) {
  const url = `https://github.com/motion-canvas/motion-canvas/blob/main/examples/src/scenes/${name}.tsx`;
  return (
    <Link to={url} className={clsx('padding--sm', styles.link)}>
      <span>View source code</span>
      <IconCode className={styles.icon} />
    </Link>
  );
}
