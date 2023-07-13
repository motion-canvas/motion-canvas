import {Input} from '../controls';
import {useSubscribableValue} from '../../hooks';
import {Vector2MetaField} from '@motion-canvas/core/lib/meta';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface Vector2MetaFieldViewProps {
  field: Vector2MetaField;
}

export function Vector2MetaFieldView({field}: Vector2MetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  return (
    <MetaFieldGroup field={field}>
      <Input
        type="number"
        value={value.x}
        onChange={event => {
          const x = parseInt((event.target as HTMLInputElement).value);
          field.set([x, value.y]);
        }}
      />
      <Input
        type="number"
        value={value.y}
        onChange={event => {
          const y = parseInt((event.target as HTMLInputElement).value);
          field.set([value.x, y]);
        }}
      />
    </MetaFieldGroup>
  );
}
