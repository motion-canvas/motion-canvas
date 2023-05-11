import {useMemo} from 'preact/hooks';
import {useCurrentScene, useCurrentFrame} from '../../hooks';
import type {Inspectable} from '@motion-canvas/core/lib/scenes';
import {isInspectable} from '@motion-canvas/core/lib/scenes/Inspectable';
import {Pane} from '../tabs';
import {useInspection} from '../../contexts';
import {AutoField} from '../fields';
import {Button, Group, Label} from '../controls';
import {findAndOpenFirstUserFile} from '../../utils';

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
