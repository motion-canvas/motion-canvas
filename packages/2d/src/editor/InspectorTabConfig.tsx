import {isInspectable} from '@motion-canvas/core';
import {
  AccountTree,
  AutoField,
  Button,
  Group,
  Label,
  Pane,
  PluginTabConfig,
  PluginTabProps,
  Separator,
  Tab,
  emphasize,
  findAndOpenFirstUserFile,
  useApplication,
  useCurrentFrame,
  useCurrentScene,
  usePanels,
  useReducedMotion,
} from '@motion-canvas/ui';
import {useEffect, useMemo, useRef} from 'preact/hooks';
import {useInspection} from './Provider';

function TabComponent({tab}: PluginTabProps) {
  const {sidebar} = usePanels();
  const inspectorTab = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const {nodeKey} = useInspection();
  const {logger} = useApplication();

  useEffect(
    () =>
      logger.onInspected.subscribe(key => {
        nodeKey.value = key;
        sidebar.set(tab);
      }),
    [nodeKey, tab],
  );

  useEffect(() => {
    if (
      nodeKey.value &&
      sidebar.current.value !== tab &&
      !reducedMotion &&
      inspectorTab.current &&
      inspectorTab.current.getAnimations().length < 2
    ) {
      inspectorTab.current.animate(emphasize(), {duration: 400});
      inspectorTab.current.animate([{color: 'white'}, {color: ''}], {
        duration: 800,
      });
    }
  }, [nodeKey.value, reducedMotion]);

  return (
    <Tab
      forwardRef={inspectorTab}
      title="Inspector"
      id="inspector-tab"
      tab={tab}
    >
      <AccountTree />
    </Tab>
  );
}

function PaneComponent() {
  const {nodeKey} = useInspection();
  const scene = useCurrentScene();
  const frame = useCurrentFrame();

  const inspectable = useMemo(
    () => (isInspectable(scene) ? scene : null),
    [scene],
  );

  const [stack, attributes] = useMemo(() => {
    const attributes = inspectable?.inspectAttributes(nodeKey.value);
    if (attributes) {
      const {stack, ...rest} = attributes;
      return [stack, rest];
    }
    return [undefined, undefined];
  }, [nodeKey.value, inspectable, frame]);

  return (
    <Pane title="Inspector" id="inspector-pane">
      <Separator size={1} />
      {stack && (
        <Group>
          <Label />
          <Button onClick={() => findAndOpenFirstUserFile(stack)} main>
            GO TO SOURCE
          </Button>
        </Group>
      )}
      {attributes
        ? Object.entries(attributes).map(([key, value]) => (
            <Group>
              <Label>{key}</Label>
              <AutoField value={value} />
            </Group>
          ))
        : inspectable
          ? 'Click on a node to view its properties.'
          : "The current scene doesn't support inspecting."}
    </Pane>
  );
}

export const InspectorTabConfig: PluginTabConfig = {
  name: 'inspector',
  tabComponent: TabComponent,
  paneComponent: PaneComponent,
};
