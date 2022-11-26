import {useMemo} from 'preact/hooks';
import {useCurrentScene, useCurrentFrame} from '../../hooks';
import type {
  Inspectable,
  InspectedAttributes,
} from '@motion-canvas/core/lib/scenes';
import {isInspectable} from '@motion-canvas/core/lib/scenes/Inspectable';
import {Pane} from '../tabs';
import {useInspection} from '../../contexts';
import {AutoField} from '../fields';

export function Properties() {
  const {inspectedElement} = useInspection();
  const scene = useCurrentScene();
  const frame = useCurrentFrame();

  const inspectable: Inspectable | null = useMemo(
    () => (isInspectable(scene) ? scene : null),
    [scene],
  );

  const attributes = useMemo(
    () => inspectable?.inspectAttributes(inspectedElement),
    [inspectedElement, inspectable, frame],
  );

  return (
    <Pane title="Properties">
      {attributes
        ? Object.entries(attributes).map(([key, value]) => (
            <AutoField label={key} value={value} />
          ))
        : inspectable
        ? "Click on an element to view it's properties."
        : "The current scene doesn't support inspecting."}
    </Pane>
  );
}
