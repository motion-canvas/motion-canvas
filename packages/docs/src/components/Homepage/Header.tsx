import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

export default function HomepageHeader() {
  return (
    <>
      <header className={styles.banner}>
        <h1 className={styles.title}>
          Visualize Complex
          <br />
          Ideas <b>Programmatically</b>
        </h1>
        <h1 className={clsx(styles.title, styles.mobile)}>
          Visualize
          <br />
          Complex Ideas
          <br />
          <b>Programmatically</b>
        </h1>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs">
            Get Started
          </Link>
          <a
            className="button button--outline button--lg"
            href="https://github.com/motion-canvas/motion-canvas/blob/main/CONTRIBUTING.md"
            target="_blank"
          >
            Contribute
          </a>
        </div>
      </header>
    </>
  );
}
