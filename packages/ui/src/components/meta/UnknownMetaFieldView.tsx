import {useSubscribableValue} from '../../hooks';
import {MetaField} from '@motion-canvas/core/lib/meta';
import {AutoField} from '../fields';

export interface UnknownMetaFieldViewProps {
  field: MetaField<any>;
}

export function UnknownMetaFieldView({field}: UnknownMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  return <AutoField label={field.name} value={value} />;
}
