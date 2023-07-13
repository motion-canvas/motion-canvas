import {Select} from '../controls';
import type {EnumMetaField} from '@motion-canvas/core/lib/meta';
import {useSubscribableValue} from '../../hooks';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface EnumMetaFieldViewProps {
  field: EnumMetaField<any>;
}

export function EnumMetaFieldView({field}: EnumMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);
  return (
    <>
      <MetaFieldGroup field={field}>
        <Select
          options={field.options}
          value={value}
          onChange={newValue => field.set(newValue)}
        />
      </MetaFieldGroup>
    </>
  );
}
