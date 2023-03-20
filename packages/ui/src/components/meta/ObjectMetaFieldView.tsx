import type {ObjectMetaField} from '@motion-canvas/core/lib/meta';
import {MetaFieldView} from './MetaFieldView';

export interface ObjectMetaFieldViewProps {
  field: ObjectMetaField<any>;
}

export function ObjectMetaFieldView({field}: ObjectMetaFieldViewProps) {
  return (
    <>
      {[...field].map(subfield => (
        <MetaFieldView field={subfield} />
      ))}
    </>
  );
}
