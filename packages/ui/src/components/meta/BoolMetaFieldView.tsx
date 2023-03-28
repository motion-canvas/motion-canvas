import {Checkbox, Group, Label} from '../controls';
import {useSubscribableValue} from '../../hooks';
import type {BoolMetaField} from '@motion-canvas/core/lib/meta';

export interface BoolMetaFieldViewProps {
  field: BoolMetaField;
}

export function BoolMetaFieldView({field}: BoolMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  return (
    <Group>
      <Label>{field.name}</Label>
      <Checkbox
        checked={value}
        onChange={() => {
          field.set(!value);
        }}
      />
    </Group>
  );
}
