import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

import featureOne from '@site/static/img/feature_one.svg';
import featureTwo from '@site/static/img/feature_three.svg';
import featureThree from '@site/static/img/feature_two.svg';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Feature One',
    Svg: featureOne,
    description: (
      <>
        Adipisci maxime non quod temporibus! Deserunt doloremque esse harum id
        illo incidunt laborum.
      </>
    ),
  },
  {
    title: 'Feature Two',
    Svg: featureTwo,
    description: (
      <>
        Enim impedit labore maxime? Aliquid assumenda cum explicabo illum ipsa,
        ipsam, laudantium libero minima molestiae.
      </>
    ),
  },
  {
    title: 'Feature Three',
    Svg: featureThree,
    description: (
      <>
        A cumque delectus dolorum earum, et eum excepturi harum iusto labore,
        laudantium minus mollitia natus nisi numquam obcaecati.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
