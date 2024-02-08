import React from 'react';
import {useUrlLookup} from '@site/src/contexts/api';
import Item from '@site/src/components/Api/Item';

export default function ApiSnippet({url}: {url: string}) {
  const reflection = useUrlLookup()(url);
  return <Item reflection={reflection} headless />;
}
