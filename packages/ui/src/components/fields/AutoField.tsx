import {Color, Spacing, Vector2, isType} from '@motion-canvas/core';
import {FunctionComponent} from 'preact';
import {ArrayField} from './ArrayField';
import {ColorField} from './ColorField';
import {NumberField} from './NumberField';
import {SpacingField} from './SpacingField';
import {UnknownField} from './UnknownField';
import {Vector2Field} from './Vector2Field';

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
