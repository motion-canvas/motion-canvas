import type {NumberMetaField} from '@motion-canvas/core/lib/meta';
import {Group, Input, InputSelect, Label} from '../controls';
import {useSubscribableValue} from '../../hooks';

export interface NumberMetaFieldViewProps {
  field: NumberMetaField;
}

export function NumberMetaFieldView({field}: NumberMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);
  const presets = field.getPresets();

  return (
    <Group>
      <Label>{field.name}</Label>
      {presets.length ? (
        <InputSelect
          value={value}
          onChange={value => {
            field.set(value);
          }}
          options={presets}
        />
      ) : (
        <Input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={event => {
            field.set((event.target as HTMLInputElement).value);
          }}
        />
      )}
    </Group>
  );
}
