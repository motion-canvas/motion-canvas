import React from 'react';
import styles from './styles.module.css';

export interface PullRequestProps {
  id: number;
}

export default function PullRequest({id}: PullRequestProps) {
  return (
    <a
      className={styles.pr}
      title={`Pull request #${id}`}
      href={`https://github.com/motion-canvas/motion-canvas/pull/${id}`}
      target="_blank"
    >
      <small>#{id}</small>
    </a>
  );
}
