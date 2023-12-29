import {ApiProvider} from '@site/src/contexts/api';
import {FiltersProvider} from '@site/src/contexts/filters';
import api from '@site/src/generated/api';
import sidebar from '@site/src/generated/sidebar';
import DocPage, {Props} from '@theme/DocPage';
import React from 'react';

export default function ApiPage(props: Props) {
  return (
    <ApiProvider lookup={api.lookups} urlLookup={api.urlLookups}>
      <FiltersProvider>
        <DocPage
          {...props}
          versionMetadata={{
            version: 'current',
            pluginId: 'default',
            className: '',
            badge: false,
            docs: {},
            banner: null,
            isLast: false,
            label: 'test',
            docsSidebars: {
              api: sidebar,
            },
          }}
        />
      </FiltersProvider>
    </ApiProvider>
  );
}
