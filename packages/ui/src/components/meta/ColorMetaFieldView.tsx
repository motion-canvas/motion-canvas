import {ColorInput} from '../controls';
import {useSubscribableValue} from '../../hooks';
import type {ColorMetaField} from '@motion-canvas/core/lib/meta';
import {MetaFieldGroup} from './MetaFieldGroup';
import {useState} from 'preact/hooks';

export interface ColorMetaFieldViewProps {
  field: ColorMetaField;
}

export function ColorMetaFieldView({field}: ColorMetaFieldViewProps) {
  const value = useSubscribableValue(field.onChanged);
  const [force, setForce] = useState(0);

  return (
    <MetaFieldGroup field={field}>
      <ColorInput
        value={value}
        onChange={value => {
          field.set(value ? value : field.initial);
          // Force re-render in case the initial color was the same as the
          // previous one.
          setForce(force + 1);
        }}
      />
    </MetaFieldGroup>
  );
}
