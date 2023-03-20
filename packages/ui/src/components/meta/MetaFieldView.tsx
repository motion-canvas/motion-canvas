import type {MetaField} from '@motion-canvas/core/lib/meta';
import type {FunctionComponent} from 'preact';
import {NumberMetaFieldView} from './NumberMetaFieldView';
import {StringMetaFieldView} from './StringMetaFieldView';
import {BoolMetaFieldView} from './BoolMetaFieldView';
import {ObjectMetaFieldView} from './ObjectMetaFieldView';
import {EnumMetaFieldView} from './EnumMetaFieldView';
import {EnumMetaField} from '@motion-canvas/core/lib/meta';
import {Color, Vector2} from '@motion-canvas/core/lib/types';
import {ColorMetaFieldView} from './ColorMetaFieldView';
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
  [Object, ObjectMetaFieldView],
]);

export function MetaFieldView({field}: MetaFieldViewProps) {
  const Field: FiledView = TYPE_MAP.get(field.type) ?? StringMetaFieldView;

  return <Field field={field} />;
}
