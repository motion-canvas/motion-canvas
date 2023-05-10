import {ColorInput} from '../controls';
import {useSubscribableValue} from '../../hooks';
import type {ColorMetaField} from '@motion-canvas/core/lib/meta';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface ColorMetaFieldViewProps {
  field: ColorMetaField;
}

export function ColorMetaFieldView({field}: ColorMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);

  return (
    <MetaFieldGroup field={field}>
      <ColorInput
        value={value}
        onChange={value => {
          field.set(value ? value : null);
        }}
      />
    </MetaFieldGroup>
  );
}
