import {Group, Label} from '../controls';
import type {ComponentChildren} from 'preact';
import type {MetaField} from '@motion-canvas/core/lib/meta';
import {useMemo} from 'preact/hooks';

export interface MetaFieldGroupProps {
  children: ComponentChildren;
  field: MetaField<unknown>;
}

export function MetaFieldGroup({field, children}: MetaFieldGroupProps) {
  const description = useMemo(() => {
    let result = '';
    let charCount = 0;
    const words = field.description.split(' ');
    for (const word of words) {
      if (charCount + word.length > 40) {
        result += '\n';
        charCount = 0;
      }
      result += word + ' ';
      charCount += word.length + 1;
    }

    return result;
  }, [field.description]);

  return (
    <Group title={description}>
      <Label title={description}>{field.name}</Label>
      {children}
    </Group>
  );
}
