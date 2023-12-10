import Link from '@docusaurus/Link';
import {ThemeConfig} from '@docusaurus/preset-classic';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ThemedImage from '@theme/ThemedImage';
import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';

export default function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const logo = (siteConfig.themeConfig as ThemeConfig).navbar.logo;

  return (
    <div className={clsx(styles.feature, styles.banner)}>
      <ThemedImage
        sources={{
          dark: logo.srcDark,
          light: logo.src,
        }}
        alt={logo.alt}
        className={clsx(styles.logo, logo.className)}
      />
      <div className={styles.content}>
        <h1 className={styles.title}>
          <b>Visualize</b> Your
          <br />
          <b>Ideas</b> With Code
        </h1>
        <p className={styles.description}>{siteConfig.tagline}</p>
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
      </div>
    </div>
  );
}
