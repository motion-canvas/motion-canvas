import type {MetaField, ObjectMetaField} from '@motion-canvas/core/lib/meta';
import {MetaFieldView} from './MetaFieldView';
import {useSubscribableValue} from '../../hooks';

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
