import {computed, ReadonlySignal} from '@preact/signals';
import {ComponentChildren, createContext} from 'preact';
import {useContext, useMemo} from 'preact/hooks';
import {PluginInspectorConfig, PluginTabConfig} from '../plugin';
import {EditorPanel, storedSignal} from '../signals';
import {useApplication} from './application';

interface Panel {
  current: ReadonlySignal<string | null>;
  isHidden: ReadonlySignal<boolean>;
  set(value: string | null): void;
}

interface Panels {
  sidebar: Panel;
  bottom: Panel;
  tabs: PluginTabConfig[];
  inspectors: PluginInspectorConfig[];
}

const PanelsContext = createContext<Panels | null>(null);

export function usePanels(): Panels {
  return useContext(PanelsContext);
}

export function PanelsProvider({children}: {children: ComponentChildren}) {
  const {plugins} = useApplication();
  const tabs = useMemo(() => {
    const tabs: PluginTabConfig[] = [];
    for (const plugin of plugins) {
      for (const tab of plugin.tabs ?? []) {
        tabs.push({
          ...tab,
          name: `${plugin.name}-${tab.name}`,
        });
      }
    }

    return tabs;
  }, [plugins]);

  const inspectors = useMemo(() => {
    const inspectors: PluginInspectorConfig[] = [];
    for (const plugin of plugins) {
      for (const inspector of plugin.inspectors ?? []) {
        inspectors.push(inspector);
      }
    }

    return inspectors;
  }, [plugins]);

  const options = useMemo(() => {
    const options = tabs.map(tab => tab.name);
    options.push(...Object.values(EditorPanel));
    return options;
  }, [tabs]);

  const sidebar = panelSignal(EditorPanel.VideoSettings, 'sidebar', options);
  const bottom = panelSignal(EditorPanel.Timeline, 'bottom-panel', options);

  return (
    <PanelsContext.Provider
      value={{
        sidebar,
        bottom,
        tabs,
        inspectors,
      }}
    >
      {children}
    </PanelsContext.Provider>
  );
}

function panelSignal(initial: string, id: string, options: string[]): Panel {
  const stored = storedSignal<string>(initial, id, value =>
    options.includes(value) ? value : initial,
  );
  const isHidden = storedSignal(stored.value === null, `${id}-hidden`);
  const current = computed(() => (isHidden.value ? null : stored.value));
  return {
    current,
    isHidden,
    set(value) {
      if (value === null) {
        isHidden.value = true;
      } else {
        stored.value = value;
        isHidden.value = false;
      }
    },
  };
}
