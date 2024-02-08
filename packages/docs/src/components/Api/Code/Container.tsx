import React, {ReactNode} from 'react';

import Container from '@theme/CodeBlock/Container';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function ApiContainer({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return (
    <Container
      as="div"
      className={clsx(styles.codeBlockContainer, 'language-typescript')}
    >
      {children}
    </Container>
  );
}
