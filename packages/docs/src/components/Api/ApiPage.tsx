import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {ApiProvider, apiData, apiSidebar} from '@site/src/contexts/api';
import {FiltersProvider} from '@site/src/contexts/filters';
import DocRoot from '@theme/DocRoot';
import type {Props} from '@theme/DocVersionRoot';
import DocVersionRoot from '@theme/DocVersionRoot';
import Layout from '@theme/Layout';
import type {RouteConfig} from 'react-router-config';

export default function ApiPage(props: Omit<Props, 'version'>) {
  const docRootRoute: RouteConfig = {
    path: props.route.path,
    exact: false,
    component: DocRoot as RouteConfig['component'],
    routes: props.route.routes as RouteConfig[],
  };

  return (
    <ApiProvider lookup={apiData.lookups} urlLookup={apiData.urlLookups}>
      <FiltersProvider>
        <Layout>
          <HtmlClassNameProvider className={ThemeClassNames.wrapper.docsPages}>
            <DocVersionRoot
              {...props}
              version={{
                version: 'current',
                pluginId: 'default',
                className: '',
                badge: false,
                noIndex: false,
                docs: {},
                banner: null,
                isLast: false,
                label: 'test',
                docsSidebars: {
                  api: apiSidebar,
                },
              }}
              route={{...props.route, routes: [docRootRoute]}}
            />
          </HtmlClassNameProvider>
        </Layout>
      </FiltersProvider>
    </ApiProvider>
  );
}
