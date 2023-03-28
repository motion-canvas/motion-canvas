import {Group, Label, Select} from '../controls';
import type {EnumMetaField} from '@motion-canvas/core/lib/meta';
import {useSubscribableValue} from '../../hooks';

export interface EnumMetaFieldViewProps {
  field: EnumMetaField<any>;
}

export function EnumMetaFieldView({field}: EnumMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);
  return (
    <>
      <Group>
        <Label>{field.name}</Label>
        <Select
          options={field.options}
          value={value}
          onChange={newValue => field.set(newValue)}
        />
      </Group>
    </>
  );
}
