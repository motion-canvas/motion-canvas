import {useSubscribableValue} from '../../hooks';
import {MetaField} from '@motion-canvas/core/lib/meta';
import {AutoField} from '../fields';
import {Group, Label} from '../controls';

export interface UnknownMetaFieldViewProps {
  field: MetaField<any>;
}

export function UnknownMetaFieldView({field}: UnknownMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  return (
    <Group>
      <Label>{field.name}</Label>
      <AutoField value={value} />
    </Group>
  );
}
