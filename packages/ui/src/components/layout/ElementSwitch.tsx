import {Fragment} from 'preact';
import {useMemo} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {PluginTabConfig} from '../../plugin';

export interface ElementSwitchProps<T extends string> {
  value: T;
  cases: Partial<Record<T, PluginTabConfig['paneComponent']>>;
}

export function ElementSwitch<T extends string>({
  value,
  cases,
}: ElementSwitchProps<T>) {
  const {plugins} = useApplication();
  const lookup = useMemo(() => {
    const lookup = new Map<string, PluginTabConfig['paneComponent']>();

    for (const [key, value] of Object.entries<PluginTabConfig['paneComponent']>(
      cases,
    )) {
      lookup.set(key, value);
    }

    for (const plugin of plugins) {
      for (const tab of plugin.tabs ?? []) {
        lookup.set(`${plugin.name}-${tab.name}`, tab.paneComponent);
      }
    }

    return lookup;
  }, [plugins, cases]);

  if (lookup.has(value)) {
    const Element = lookup.get(value);
    return <Element tab={value} />;
  } else {
    return <Fragment />;
  }
}
