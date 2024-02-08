import {isType} from '@motion-canvas/core/lib/types/Type';
import {FunctionComponent} from 'preact';
import {Color, Spacing, Vector2} from '@motion-canvas/core/lib/types';
import {Vector2Field} from './Vector2Field';
import {UnknownField} from './UnknownField';
import {NumberField} from './NumberField';
import {ColorField} from './ColorField';
import {SpacingField} from './SpacingField';
import {ArrayField} from './ArrayField';

export interface AutoFieldProps {
  value: any;
}

const TYPE_MAP: Record<symbol, FunctionComponent<{value: any}>> = {
  [Vector2.symbol]: Vector2Field,
  [Color.symbol]: ColorField,
  [Spacing.symbol]: SpacingField,
};

export function AutoField({value}: AutoFieldProps) {
  let Field = UnknownField;
  if (isType(value)) {
    Field = TYPE_MAP[value.toSymbol()] ?? UnknownField;
  } else if (typeof value === 'number') {
    Field = NumberField;
  } else if (Array.isArray(value)) {
    Field = ArrayField;
  }

  return <Field value={value} />;
}
