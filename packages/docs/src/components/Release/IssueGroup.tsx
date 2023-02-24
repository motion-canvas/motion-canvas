import styles from '@site/src/components/Release/styles.module.css';
import React, {ReactNode} from 'react';

export interface IssueGroupProps {
  type: 'feat' | 'fix';
  children: ReactNode | ReactNode[];
}

const titles = {
  feat: 'New features',
  fix: 'Fixed bugs',
};

export default function IssueGroup({type, children}: IssueGroupProps) {
  return (
    <>
      <h3>{titles[type]}</h3>
      <ul className={styles.group}>{children}</ul>
    </>
  );
}
