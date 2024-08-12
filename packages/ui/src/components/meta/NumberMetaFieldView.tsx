import type {NumberMetaField} from '@motion-canvas/core';
import {useSubscribableValue} from '../../hooks';
import {NumberInput, NumberInputSelect} from '../controls';
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
        <NumberInputSelect
          value={value}
          min={field.getMin()}
          max={field.getMax()}
          onChange={value => {
            field.set(value);
          }}
          options={presets}
        />
      ) : (
        <NumberInput
          value={value}
          min={field.getMin()}
          max={field.getMax()}
          onChange={value => field.set(value)}
        />
      )}
    </MetaFieldGroup>
  );
}
