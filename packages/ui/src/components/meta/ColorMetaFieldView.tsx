import {ColorInput, Group, Label} from '../controls';
import {useSubscribableValue} from '../../hooks';
import type {ColorMetaField} from '@motion-canvas/core/lib/meta';

export interface ColorMetaFieldViewProps {
  field: ColorMetaField;
}

export function ColorMetaFieldView({field}: ColorMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  return (
    <Group>
      <Label>{field.name}</Label>
      <ColorInput
        value={value}
        onChange={value => {
          field.set(value ? value : null);
        }}
      />
    </Group>
  );
}
