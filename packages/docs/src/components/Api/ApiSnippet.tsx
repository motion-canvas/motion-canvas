import Item from '@site/src/components/Api/Item';
import {useUrlLookup} from '@site/src/contexts/api';
import type {JSONOutput} from 'typedoc';

export default function ApiSnippet({url}: {url: string}) {
  const reflection = useUrlLookup()(url) as JSONOutput.DeclarationReflection;
  return <Item reflection={reflection} headless />;
}
