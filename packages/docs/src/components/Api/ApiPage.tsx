import React, {FunctionComponent} from 'react';
import DocPage, {Props} from '@theme/DocPage';
import {
  ApiLookups,
  ApiProvider,
  ReflectionReference,
} from '@site/src/contexts/api';
import {PropSidebar} from '@docusaurus/plugin-content-docs';
import {FiltersProvider} from '@site/src/contexts/filters';

interface ApiPageProps extends Props {
  lookup: {
    lookups: ApiLookups;
    urlLookups: Record<string, ReflectionReference>;
    sidebar: PropSidebar;
  };
  contents: Record<string, FunctionComponent>;
  route: {
    reflectionId: number;
  };
}

export default function ApiPage(props: ApiPageProps) {
  const {lookup, contents, ...rest} = props;

  return (
    <ApiProvider
      lookup={lookup.lookups}
      urlLookup={lookup.urlLookups}
      contents={contents}
      id={props.route.reflectionId}
    >
      <FiltersProvider>
        <DocPage
          {...rest}
          versionMetadata={{
            version: 'current',
            pluginId: 'typedoc',
            className: '',
            badge: false,
            docs: {},
            banner: null,
            isLast: false,
            label: 'test',
            docsSidebars: {
              api: lookup.sidebar,
            },
          }}
        />
      </FiltersProvider>
    </ApiProvider>
  );
}
