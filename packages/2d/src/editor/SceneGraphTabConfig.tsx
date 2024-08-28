import {
  AccountTree,
  emphasize,
  Pane,
  PluginTabConfig,
  PluginTabProps,
  Tab,
  useApplication,
  usePanels,
  useReducedMotion,
  useSurfaceShortcuts,
} from '@motion-canvas/ui';
import {useSignalEffect} from '@preact/signals';
import {useEffect, useRef} from 'preact/hooks';
import {usePluginState} from './Provider';
import {SCENE_GRAPH_SHORTCUTS} from './shortcuts';
import {DetachedRoot, useKeyboardNavigation, ViewRoot} from './tree';

function TabComponent({tab}: PluginTabProps) {
  const {sidebar} = usePanels();
  const inspectorTab = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const {selectedNode, selectNode} = usePluginState();
  const {logger} = useApplication();

  useEffect(
    () =>
      logger.onInspected.subscribe(key => {
        sidebar.set(tab);
        selectNode(key);
      }),
    [tab],
  );

  useSignalEffect(() => {
    if (
      selectedNode.value &&
      sidebar.current.peek() !== tab &&
      !reducedMotion &&
      inspectorTab.current &&
      inspectorTab.current.getAnimations().length < 2
    ) {
      inspectorTab.current.animate(emphasize(), {duration: 400});
      inspectorTab.current.animate([{color: 'white'}, {color: ''}], {
        duration: 800,
      });
    }
  });

  return (
    <Tab
      forwardRef={inspectorTab}
      title="Scene Graph"
      id="scene-graph-tab"
      tab={tab}
    >
      <AccountTree />
    </Tab>
  );
}

function PaneComponent() {
  const ref = useSurfaceShortcuts<HTMLDivElement>(SCENE_GRAPH_SHORTCUTS);
  const {selectNode} = usePluginState();

  useKeyboardNavigation();

  return (
    <Pane
      forwardRef={ref}
      title="Scene Graph"
      id="scene-graph-pane"
      onClick={() => {
        selectNode(null);
      }}
    >
      <ViewRoot />
      <DetachedRoot />
    </Pane>
  );
}

export const SceneGraphTabConfig: PluginTabConfig = {
  name: 'scene-graph',
  tabComponent: TabComponent,
  paneComponent: PaneComponent,
};
