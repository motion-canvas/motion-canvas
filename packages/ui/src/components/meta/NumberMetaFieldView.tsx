import type {NumberMetaField} from '@motion-canvas/core';
import {useSubscribableValue} from '../../hooks';
import {Input, InputSelect} from '../controls';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface NumberMetaFieldViewProps {
  field: NumberMetaField;
}

export function NumberMetaFieldView({field}: NumberMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);
  const presets = field.getPresets();

  return (
    <MetaFieldGroup field={field}>
      {presets.length ? (
        <InputSelect
          type="number"
          value={value}
          onChange={value => {
            field.set(value);
          }}
          options={presets}
        />
      ) : (
        <Input
          type="number"
          value={value}
          onChange={event => {
            field.set((event.target as HTMLInputElement).value);
          }}
        />
      )}
    </MetaFieldGroup>
  );
}
