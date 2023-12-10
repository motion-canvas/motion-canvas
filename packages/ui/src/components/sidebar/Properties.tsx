import type {Inspectable} from '@motion-canvas/core';
import {isInspectable} from '@motion-canvas/core';
import {useMemo} from 'preact/hooks';
import {useInspection} from '../../contexts';
import {useCurrentFrame, useCurrentScene} from '../../hooks';
import {findAndOpenFirstUserFile} from '../../utils';
import {Button, Group, Label, Separator} from '../controls';
import {AutoField} from '../fields';
import {Pane} from '../tabs';

export function Properties() {
  const {inspectedElement} = useInspection();
  const scene = useCurrentScene();
  const frame = useCurrentFrame();

  const inspectable: Inspectable | null = useMemo(
    () => (isInspectable(scene) ? scene : null),
    [scene],
  );

  const [stack, attributes] = useMemo(() => {
    const attributes = inspectable?.inspectAttributes(inspectedElement);
    if (attributes) {
      const {stack, ...rest} = attributes;
      return [stack, rest];
    }
    return [undefined, undefined];
  }, [inspectedElement, inspectable, frame]);

  return (
    <Pane title="Properties" id="properties-pane">
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
