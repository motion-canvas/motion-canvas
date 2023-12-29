import {TOCItem} from '@docusaurus/mdx-loader';
import {DocProvider} from '@docusaurus/theme-common/internal';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Item from '@site/src/components/Api/Item';
import Tooltip from '@site/src/components/Tooltip';
import {useApiLookup} from '@site/src/contexts/api';
import {ThemeDictProvider} from '@site/src/contexts/codeTheme';
import {matchFilters, useFilters} from '@site/src/contexts/filters';
import DocItemLayout from '@theme/DocItem/Layout';
import DocItemMetadata from '@theme/DocItem/Metadata';
import React, {useMemo} from 'react';
import type {JSONOutput} from 'typedoc';
import {ReflectionKind} from './ReflectionKind';

const ExperimentalIcon = `
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" 
  fill="currentColor" 
  class="experimental" 
  data-experimental="data-experimental">
  <path d="M19.8,18.4L14,10.67V6.5l1.35-1.69C15.61,4.48,15.38,4,14.96,4H9.04C8.62,4,8.39,4.48,8.65,4.81L10,6.5v4.17L4.2,18.4 C3.71,19.06,4.18,20,5,20h14C19.82,20,20.29,19.06,19.8,18.4z"/>
</svg>`;

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

  const isBrowser = useIsBrowser();
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
          if (
            !child ||
            child.hasOwnPage ||
            (isBrowser && !matchFilters(filters, child))
          ) {
            continue;
          }
          toc.push({
            value: `${child.experimental ? ExperimentalIcon : ''}<code>${
              child.name
            }</code>`,
            id: child.anchor,
            level: 3,
          });
        }
      }
    }
    return toc;
  }, [filters, reflection, isBrowser]);

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
