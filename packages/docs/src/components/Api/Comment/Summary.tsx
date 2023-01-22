import React from 'react';
import * as summaries from '@site/src/generated/markdown';

export default function Summary({id}: {id: string}) {
  const Content = summaries[id] ?? React.Fragment;
  return <Content />;
}
