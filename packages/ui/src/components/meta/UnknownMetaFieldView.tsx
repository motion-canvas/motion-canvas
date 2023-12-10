import {MetaField} from '@motion-canvas/core';
import {useSubscribableValue} from '../../hooks';
import {Group, Label} from '../controls';
import {AutoField} from '../fields';

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
