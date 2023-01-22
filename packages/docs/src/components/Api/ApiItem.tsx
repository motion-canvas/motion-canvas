import React, {useMemo} from 'react';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
import {DocProvider} from '@docusaurus/theme-common/internal';
import Item from '@site/src/components/Api/Item';
import {useApiLookup} from '@site/src/contexts/api';
import {ThemeDictProvider} from '@site/src/contexts/codeTheme';
import {matchFilters, useFilters} from '@site/src/contexts/filters';
import {TOCItem} from '@docusaurus/mdx-loader';
import Tooltip from '@site/src/components/Tooltip';
import type {JSONOutput} from 'typedoc';
import {ReflectionKind} from './ReflectionKind';

interface ApiItemProps {
  route: {
    reflectionId: number;
    projectId: number;
  };
}

export default function ApiItem({route}: ApiItemProps): JSX.Element {
  const lookup = useApiLookup(route.projectId);
  const reflection: JSONOutput.DeclarationReflection =
    lookup[route.reflectionId];
  const [filters] = useFilters();
  const toc = useMemo(() => {
    const toc: TOCItem[] = [];
    if (!reflection.groups || reflection.kind === ReflectionKind.Project) {
      return toc;
    }

    for (const group of reflection.groups) {
      toc.push({
        value: group.title,
        id: group.title,
        level: 2,
      });
      if (group.children) {
        for (const id of group.children) {
          const child = lookup[id];
          if (!child || child.hasOwnPage || !matchFilters(filters, child)) {
            continue;
          }
          toc.push({
            value: `<code>${child.name}</code>`,
            id: child.anchor,
            level: 3,
          });
        }
      }
    }
    return toc;
  }, [reflection, filters]);

  return (
    <DocProvider
      content={{
        frontMatter: {},
        metadata: {
          id: reflection.docId,
          unversionedId: reflection.docId,
          version: 'current',
          title: reflection.name,
          description: reflection.comment?.summaryText,
          slug: reflection.url,
          permalink: reflection.url,
          editUrl: reflection.sources?.[0]?.url ?? undefined,
          draft: false,
          tags: [],
          frontMatter: {},
          next: reflection.next,
          previous: reflection.previous,
        },
        toc,
        assets: {},
      }}
    >
      <ThemeDictProvider>
        <DocItemMetadata />
        <Tooltip>
          <DocItemLayout>
            <Item reflection={reflection} />
          </DocItemLayout>
        </Tooltip>
      </ThemeDictProvider>
    </DocProvider>
  );
}
