import {Color} from '@motion-canvas/core';
import {ColorPreview} from '../controls/ColorPreview';
import {Field, FieldSet, FieldValue, NumericField} from './Layout';

export interface ColorFieldProps {
  value: Color;
}

export function ColorField({value}: ColorFieldProps) {
  const color = value.serialize();
  return (
    <FieldSet
      header={
        <Field copy={color}>
          <FieldValue>{color}</FieldValue>
          <FieldValue alignRight grow={false}>
            <ColorPreview color={color} />
          </FieldValue>
        </Field>
      }
    >
      <NumericField label="red" precision={0}>
        {value.get('rgb.r')}
      </NumericField>
      <NumericField label="green" precision={0}>
        {value.get('rgb.g')}
      </NumericField>
      <NumericField label="blue" precision={0}>
        {value.get('rgb.b')}
      </NumericField>
      <NumericField label="alpha">{value.alpha()}</NumericField>
    </FieldSet>
  );
}
