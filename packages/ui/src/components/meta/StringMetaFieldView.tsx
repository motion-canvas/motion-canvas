import type {StringMetaField} from '@motion-canvas/core';
import {useSubscribableValue} from '../../hooks';
import {Input, InputSelect} from '../controls';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface StringMetaFieldViewProps {
  field: StringMetaField;
}

export function StringMetaFieldView({field}: StringMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);
  const presets = field.getPresets();

  return (
    <MetaFieldGroup field={field}>
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
    </MetaFieldGroup>
  );
}
