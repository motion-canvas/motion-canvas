import {
  AutoField,
  Button,
  Group,
  Label,
  Pane,
  PluginInspectorConfig,
  Separator,
  UnknownField,
  findAndOpenFirstUserFile,
  useApplication,
} from '@motion-canvas/ui';
import {useComputed} from '@preact/signals';
import {NodeInspectorKey, usePluginState} from './Provider';

function Component() {
  const {inspection} = useApplication();
  const {scene, afterRender} = usePluginState();
  const node = useComputed(() => {
    afterRender.value;
    const {payload} = inspection.value;
    return scene.value?.getNode(payload as string);
  });

  const attributes = useComputed(() => {
    afterRender.value;
    const currentNode = node.value;
    const attributes: [string, unknown][] = [];

    if (currentNode) {
      for (const {key, meta, signal} of currentNode) {
        if (!meta.inspectable) continue;
        attributes.push([key, signal()]);
      }
    }

    return attributes;
  });

  const stack = node.value?.creationStack;

  return (
    <Pane title="Node Inspector" id="node-inspector-pane">
      <Separator size={1} />
      {stack && (
        <Group>
          <Label />
          <Button onClick={() => findAndOpenFirstUserFile(stack)} main>
            GO TO SOURCE
          </Button>
        </Group>
      )}
      <Group>
        <Label>key</Label>
        <UnknownField value={inspection.value.payload} />
      </Group>
      {!node.value && (
        <Group>
          <Label />
          Couldn't find the node. It may have been deleted or doesn't exist yet.
        </Group>
      )}
      {attributes.value.map(([key, value]) => (
        <Group key={key}>
          <Label>{key}</Label>
          <AutoField value={value} />
        </Group>
      ))}
    </Pane>
  );
}

export const NodeInspectorConfig: PluginInspectorConfig = {
  key: NodeInspectorKey,
  component: Component,
};
