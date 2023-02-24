import styles from '@site/src/components/Release/styles.module.css';
import React, {ReactNode} from 'react';
import Contributor from '@site/src/components/Release/Contributor';
import PullRequest from '@site/src/components/Release/PullRequest';

export interface IssueProps {
  user: string;
  pr: number;
  children: ReactNode | ReactNode[];
}

export default function Issue({user, pr, children}: IssueProps) {
  return (
    <li className={styles.element}>
      <Contributor name={user} />
      {children}
      <PullRequest id={pr} />
    </li>
  );
}
