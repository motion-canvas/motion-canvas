import React from 'react';
import {useUrlLookup} from '@site/src/contexts/api';
import Item from '@site/src/components/Api/Item';
import Link from '@docusaurus/Link';

export default function ApiSnippet({url}: {url: string}) {
  const reflection = useUrlLookup()(url);
  return (
    <>
      <Item reflection={reflection} headless />
      <Link to={reflection.href}>
        <small>Got to the API documentation</small>
      </Link>
    </>
  );
}
