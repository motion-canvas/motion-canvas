import {Details} from '@docusaurus/theme-common/Details';
import React from 'react';
import styles from './Details.module.css';

export default function MDXDetails(props) {
  const items = React.Children.toArray(props.children);
  const summary = items.find(
    item => React.isValidElement(item) && item.props?.mdxType === 'summary',
  );
  const children = <>{items.filter(item => item !== summary)}</>;
  return (
    <>
      <Details {...props} summary={summary} className={styles.root}>
        {children}
      </Details>
    </>
  );
}
