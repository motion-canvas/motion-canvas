import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageHeader from '@site/src/components/Homepage/Header';
import HomepageFeatures from '@site/src/components/Homepage/Features';
import Head from '@docusaurus/Head';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Head>
        <title>
          {siteConfig.title} - {siteConfig.tagline}
        </title>
        <meta property="og:title" content={siteConfig.title} />
      </Head>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
