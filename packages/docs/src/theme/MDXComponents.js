import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import FiddleCodeBlock from '@site/src/components/Fiddle/FiddleCodeBlock';

export default {
  ...MDXComponents,
  pre: FiddleCodeBlock,
};
