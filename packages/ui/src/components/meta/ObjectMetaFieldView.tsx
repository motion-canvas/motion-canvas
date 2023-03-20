import {Group, Label} from '../controls';
import type {ObjectMetaField} from '@motion-canvas/core/lib/meta';
import {MetaFieldView} from './MetaFieldView';
import {Separator} from '../controls/Separator';

export interface ObjectMetaFieldViewProps {
  field: ObjectMetaField<any>;
}

export function ObjectMetaFieldView({field}: ObjectMetaFieldViewProps) {
  return (
    <>
      <Group>
        <Label />
        <Separator>{field.name}</Separator>
      </Group>
      {[...field].map(subfield => (
        <MetaFieldView field={subfield} />
      ))}
    </>
  );
}
