import {Vector2MetaField} from '@motion-canvas/core';
import {useSubscribableValue} from '../../hooks';
import {clamp} from '../../utils';
import {NumberInput} from '../controls';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface Vector2MetaFieldViewProps {
  field: Vector2MetaField;
}

export function Vector2MetaFieldView({field}: Vector2MetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  const [minX, minY] = field.min;
  const [maxX, maxY] = field.max;

  const onXChanged = (x: number) => {
    if (isNaN(x)) {
      // No op when NaN is passed
      field.set(value);
      return;
    }

    const newX = clamp(minX, maxX, x);

    field.set([newX, value.y]);
  };

  const onYChanged = (y: number) => {
    if (isNaN(y)) {
      // No op when NaN is passed
      field.set(value);
      return;
    }

    const newY = clamp(minY, maxY, y);

    field.set([value.x, newY]);
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
