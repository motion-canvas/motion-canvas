import {FieldSurface, NumericField} from './Layout';

export interface NumberFieldProps {
  value: number;
}

export function NumberField({value}: NumberFieldProps) {
  return (
    <FieldSurface>
      <NumericField>{value}</NumericField>
    </FieldSurface>
  );
}
