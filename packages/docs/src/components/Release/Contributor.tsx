import React from 'react';
import styles from './styles.module.css';

export interface ContributorProps {
  name: string;
}

export default function Contributor({name}: ContributorProps) {
  return (
    <a
      className={styles.contributor}
      title={name}
      href={`https://github.com/${name}`}
      target="_blank"
    >
      <img
        loading="lazy"
        src={`https://github.com/${name}.png`}
        width={20}
        height={20}
        alt={`${name}'s avatar`}
      />
    </a>
  );
}
