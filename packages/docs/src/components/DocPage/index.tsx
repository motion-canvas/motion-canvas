import Tooltip from '@site/src/components/Tooltip';
import {ApiProvider} from '@site/src/contexts/api';
import {ThemeDictProvider} from '@site/src/contexts/codeTheme';
import api from '@site/src/generated/api';
import DocItem from '@theme/DocItem';
import React from 'react';

export default function DocPage(props) {
  return (
    <ApiProvider lookup={api.lookups} urlLookup={api.urlLookups}>
      <ThemeDictProvider>
        <Tooltip>
          <DocItem {...props} />
        </Tooltip>
      </ThemeDictProvider>
    </ApiProvider>
  );
}
