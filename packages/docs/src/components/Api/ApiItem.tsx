import {TOCItem} from '@docusaurus/mdx-loader';
import type {PropDocContent} from '@docusaurus/plugin-content-docs';
import {DocProvider} from '@docusaurus/plugin-content-docs/client';
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

export default function ApiItem({route}: ApiItemProps): React.JSX.Element {
  const lookup = useApiLookup(route.projectId);
  const reflection: JSONOutput.DeclarationReflection = lookup[
    route.reflectionId
  ] as JSONOutput.DeclarationReflection;
  const [filters] = useFilters();

  const toc = useMemo(() => {
    const toc: TOCItem[] = [];
    if (!reflection.groups || reflection.kind === ReflectionKind.Project) {
      return toc;
    }

    for (const group of reflection.groups) {
      const children = (group.categories ?? [group])
        .flatMap(category => category.children ?? [])
        .map(id => lookup[id] as JSONOutput.DeclarationReflection)
        .filter(child => !!child && matchFilters(filters, child));

      if (children.length === 0) {
        continue;
      }

      toc.push({
        value: group.title,
        id: group.title,
        level: 2,
      });
      for (const child of children) {
        if (child.hasOwnPage) {
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
    return toc;
  }, [filters, reflection, lookup]);

  return (
    <DocProvider
      content={
        {
          frontMatter: {},
          contentTitle: undefined,
          metadata: {
            id: reflection.docId,
            version: 'current',
            title: reflection.name,
            description: reflection.comment?.summaryText,
            source: '',
            sourceDirName: '',
            slug: reflection.url,
            permalink: reflection.url,
            editUrl: reflection.sources?.[0]?.url ?? undefined,
            draft: false,
            unlisted: false,
            lastUpdatedAt: null,
            lastUpdatedBy: null,
            tags: [],
            frontMatter: {},
            next: reflection.next,
            previous: reflection.previous,
          },
          toc,
          assets: {},
        } as unknown as PropDocContent
      }
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
