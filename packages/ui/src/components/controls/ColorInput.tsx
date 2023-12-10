import {Color} from '@motion-canvas/core';
import {valid} from 'chroma-js';
import clsx from 'clsx';
import {useReducedMotion} from '../../hooks';
import {shake} from '../animations';
import {ColorPreview} from './ColorPreview';
import styles from './Controls.module.scss';
import {Input} from './Input';

export interface ColorInputProps {
  value: Color | null;
  onChange: (value: string) => void;
}

export function ColorInput({value, onChange}: ColorInputProps) {
  const reducedMotion = useReducedMotion();
  return (
    <div className={clsx(styles.input, styles.color)}>
      <Input
        onChange={event => {
          const input = event.target as HTMLInputElement;
          const newValue = input.value;
          if (!newValue || valid(newValue)) {
            onChange(newValue);
          } else {
            input.value = value?.serialize() ?? '';
            if (!reducedMotion) {
              input.parentElement.animate(shake(2), {
                duration: 300,
              });
            }
          }
        }}
        placeholder="none"
        type="text"
        value={value?.serialize() ?? ''}
      />
      <ColorPreview color={value?.hex() ?? '#00000000'} />
    </div>
  );
}
