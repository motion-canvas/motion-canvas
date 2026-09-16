import Tooltip from '@site/src/components/Tooltip';
import {ApiProvider, apiData} from '@site/src/contexts/api';
import {ThemeDictProvider} from '@site/src/contexts/codeTheme';
import DocItem from '@theme/DocItem';

export default function DocPage(props) {
  return (
    <ApiProvider lookup={apiData.lookups} urlLookup={apiData.urlLookups}>
      <ThemeDictProvider>
        <Tooltip>
          <DocItem {...props} />
        </Tooltip>
      </ThemeDictProvider>
    </ApiProvider>
  );
}
