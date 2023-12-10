import type {MetaField, ObjectMetaField} from '@motion-canvas/core';
import {useSubscribableValue} from '../../hooks';
import {MetaFieldView} from './MetaFieldView';

export interface ObjectMetaFieldViewProps {
  field: ObjectMetaField<any>;
}

export function ObjectMetaFieldView({field}: ObjectMetaFieldViewProps) {
  const fields: MetaField<any>[] = useSubscribableValue(field.onFieldsChanged);

  return (
    <>
      {fields.map(subfield => (
        <MetaFieldView field={subfield} />
      ))}
    </>
  );
}
