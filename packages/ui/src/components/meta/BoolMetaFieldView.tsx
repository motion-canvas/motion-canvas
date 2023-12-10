import type {BoolMetaField} from '@motion-canvas/core';
import {useSubscribableValue} from '../../hooks';
import {Checkbox} from '../controls';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface BoolMetaFieldViewProps {
  field: BoolMetaField;
}

export function BoolMetaFieldView({field}: BoolMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  return (
    <MetaFieldGroup field={field}>
      <Checkbox
        checked={value}
        onChange={() => {
          field.set(!value);
        }}
      />
    </MetaFieldGroup>
  );
}
