import {Vector2MetaField} from '@motion-canvas/core';
import {useSubscribableValue} from '../../hooks';
import {NumberInput} from '../controls';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface Vector2MetaFieldViewProps {
  field: Vector2MetaField;
}

export function Vector2MetaFieldView({field}: Vector2MetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  return (
    <MetaFieldGroup field={field}>
      <NumberInput value={value.x} onChange={x => field.set([x, value.y])} />
      <NumberInput value={value.y} onChange={y => field.set([value.x, y])} />
    </MetaFieldGroup>
  );
}
