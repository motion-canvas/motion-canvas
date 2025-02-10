import {Vector2MetaField} from '@motion-canvas/core';
import {useSubscribableValue} from '../../hooks';
import {NumberInput} from '../controls';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface Vector2MetaFieldViewProps {
  field: Vector2MetaField;
}

export function Vector2MetaFieldView({field}: Vector2MetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  const [minX, minY] = field.getMin();
  const [maxX, maxY] = field.getMax();

  const onXChanged = (x: number) => {
    if (isNaN(x)) {
      // No op when NaN is passed
      field.set(value);
      return;
    }

    field.set([x, value.y]);
  };

  const onYChanged = (y: number) => {
    if (isNaN(y)) {
      // No op when NaN is passed
      field.set(value);
      return;
    }

    field.set([value.x, y]);
  };

  return (
    <MetaFieldGroup field={field}>
      <NumberInput
        min={minX}
        max={maxX}
        value={value.x}
        onChange={onXChanged}
      />
      <NumberInput
        min={minY}
        max={maxY}
        value={value.y}
        onChange={onYChanged}
      />
    </MetaFieldGroup>
  );
}
