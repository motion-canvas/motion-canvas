import {AutoField} from './AutoField';
import {Field, FieldSet, FieldSurface, FieldValue} from './Layout';

export interface NumberFieldProps {
  value: any[];
}

export function ArrayField({value}: NumberFieldProps) {
  const header = (
    <Field copy={JSON.stringify(value)}>
      <FieldValue>{JSON.stringify(value)}</FieldValue>
    </Field>
  );

  return value.length > 0 ? (
    <FieldSet nested header={header}>
      {value.map(item => (
        <AutoField value={item} />
      ))}
    </FieldSet>
  ) : (
    <FieldSurface>{header}</FieldSurface>
  );
}
