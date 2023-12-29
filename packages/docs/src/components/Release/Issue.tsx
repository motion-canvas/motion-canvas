import Link from '@docusaurus/Link';
import IconScience from '@site/src/Icon/Science';
import Contributor from '@site/src/components/Release/Contributor';
import PullRequest from '@site/src/components/Release/PullRequest';
import styles from '@site/src/components/Release/styles.module.css';
import React, {ReactNode} from 'react';

export interface IssueProps {
  user: string;
  pr?: number;
  experimental?: boolean;
  children: ReactNode | ReactNode[];
}

export default function Issue({user, pr, experimental, children}: IssueProps) {
  return (
    <li className={styles.element}>
      <Contributor name={user} />
      {experimental && (
        <Link to="/docs/experimental" title="Experimental feature">
          <IconScience className="experimental" />
        </Link>
      )}
      {children}
      {pr && <PullRequest id={pr} />}
    </li>
  );
}
