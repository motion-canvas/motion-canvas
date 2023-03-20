import type {MetaField} from '@motion-canvas/core/lib/meta';
import type {FunctionComponent} from 'preact';
import {NumberMetaFieldView} from './NumberMetaFieldView';
import {StringMetaFieldView} from './StringMetaFieldView';
import {BoolMetaFieldView} from './BoolMetaFieldView';
import {ObjectMetaFieldView} from './ObjectMetaFieldView';
import {EnumMetaFieldView} from './EnumMetaFieldView';
import {ColorMetaFieldView} from './ColorMetaFieldView';
import {Vector2MetaFieldView} from './Vector2MetaFieldView';
import {UnknownMetaFieldView} from './UnknownMetaFieldView';
import {RangeMetaFieldView} from './RangeMetaFieldView';
import {EnumMetaField, RangeMetaField} from '@motion-canvas/core/lib/meta';
import {Color, Vector2} from '@motion-canvas/core/lib/types';
import {useSubscribableValue} from '../../hooks';

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

  return disabled ? <></> : <Field field={field} />;
}
