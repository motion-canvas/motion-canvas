import type {MetaField} from '@motion-canvas/core';
import {
  Color,
  EnumMetaField,
  RangeMetaField,
  Vector2,
} from '@motion-canvas/core';
import type {FunctionComponent} from 'preact';
import {useSubscribableValue} from '../../hooks';
import {Separator} from '../controls';
import {BoolMetaFieldView} from './BoolMetaFieldView';
import {ColorMetaFieldView} from './ColorMetaFieldView';
import {EnumMetaFieldView} from './EnumMetaFieldView';
import {NumberMetaFieldView} from './NumberMetaFieldView';
import {ObjectMetaFieldView} from './ObjectMetaFieldView';
import {RangeMetaFieldView} from './RangeMetaFieldView';
import {StringMetaFieldView} from './StringMetaFieldView';
import {UnknownMetaFieldView} from './UnknownMetaFieldView';
import {Vector2MetaFieldView} from './Vector2MetaFieldView';

interface MetaFieldViewProps {
  field: MetaField<any>;
}

type FiledView = FunctionComponent<{field: MetaField<any>}>;

const TYPE_MAP = new Map<any, FiledView>([
  [Boolean, BoolMetaFieldView],
  [Number, NumberMetaFieldView],
  [String, StringMetaFieldView],
  [EnumMetaField.symbol, EnumMetaFieldView],
  [Color.symbol, ColorMetaFieldView],
  [Vector2.symbol, Vector2MetaFieldView],
  [RangeMetaField.symbol, RangeMetaFieldView],
  [Object, ObjectMetaFieldView],
]);

export function MetaFieldView({field}: MetaFieldViewProps) {
  const Field: FiledView = TYPE_MAP.get(field.type) ?? UnknownMetaFieldView;
  const disabled = useSubscribableValue(field.onDisabled);

  return disabled ? (
    <></>
  ) : (
    <>
      {field.spacing && <Separator />}
      <Field field={field} />
    </>
  );
}
