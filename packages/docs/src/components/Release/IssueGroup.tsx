import React, {ReactNode} from 'react';
import styles from '@site/src/components/Release/styles.module.css';
import Heading from '@theme/Heading';

export interface IssueGroupProps {
  type: 'feat' | 'fix';
  children: ReactNode | ReactNode[];
}

const titles = {
  feat: 'New features 🎉',
  fix: 'Fixed bugs 🐛',
};

const ids = {
  feat: 'new-features',
  fix: 'fixed-bugs',
};

export default function IssueGroup({type, children}: IssueGroupProps) {
  return (
    <>
      <Heading id={ids[type]} as="h3">
        {titles[type]}
      </Heading>
      <ul className={styles.group}>{children}</ul>
    </>
  );
}
