import {Spacing} from '@motion-canvas/core';
import {Field, FieldSet, FieldValue, NumericField} from './Layout';

export interface SpacingFieldProps {
  value: Spacing;
}

export function SpacingField({value}: SpacingFieldProps) {
  return (
    <FieldSet
      header={
        <Field copy={JSON.stringify(value.serialize())}>
          <FieldValue alignRight>
            {value.top}, {value.right}, {value.bottom}, {value.left}
          </FieldValue>
        </Field>
      }
    >
      <NumericField label="top">{value.top}</NumericField>
      <NumericField label="right">{value.right}</NumericField>
      <NumericField label="bottom">{value.bottom}</NumericField>
      <NumericField label="left">{value.left}</NumericField>
    </FieldSet>
  );
}
