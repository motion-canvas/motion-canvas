import {Group, Label} from '../controls';
import type {ComponentChildren} from 'preact';
import type {MetaField} from '@motion-canvas/core/lib/meta';

export interface MetaFieldGroupProps {
  children: ComponentChildren;
  field: MetaField<unknown>;
}

export function MetaFieldGroup({field, children}: MetaFieldGroupProps) {
  return (
    <Group title={field.description}>
      <Label title={field.description}>{field.name}</Label>
      {children}
    </Group>
  );
}
