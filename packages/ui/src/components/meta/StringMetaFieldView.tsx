import {Group, Input, InputSelect, Label} from '../controls';
import {useSubscribableValue} from '../../hooks';
import type {StringMetaField} from '@motion-canvas/core/lib/meta';

export interface StringMetaFieldViewProps {
  field: StringMetaField;
}

export function StringMetaFieldView({field}: StringMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);
  const presets = field.getPresets();

  return (
    <Group>
      <Label>{field.name}</Label>
      {presets.length > 0 ? (
        <InputSelect
          value={value}
          onChange={value => {
            field.set(value);
          }}
          options={presets}
        />
      ) : (
        <Input
          value={value}
          onChange={event => {
            field.set((event.target as HTMLInputElement).value);
          }}
        />
      )}
    </Group>
  );
}
