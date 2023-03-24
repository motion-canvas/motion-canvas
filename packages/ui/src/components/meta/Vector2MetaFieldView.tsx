import {Group, Input, Label} from '../controls';
import {useSubscribableValue} from '../../hooks';
import {Vector2MetaField} from '@motion-canvas/core/lib/meta';

export interface Vector2MetaFieldViewProps {
  field: Vector2MetaField;
}

export function Vector2MetaFieldView({field}: Vector2MetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  return (
    <Group>
      <Label>{field.name}</Label>
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
    </Group>
  );
}
