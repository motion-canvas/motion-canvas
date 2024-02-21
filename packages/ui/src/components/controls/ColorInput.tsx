import {Color} from '@motion-canvas/core';
import {valid} from 'chroma-js';
import clsx from 'clsx';
import {useRef, useState} from 'preact/hooks';
import {useReducedMotion} from '../../hooks';
import {useClickOutside} from '../../hooks/useClickOutside';
import {shake} from '../animations';
import {ColorPicker} from './ColorPicker';
import {ColorPreview} from './ColorPreview';
import styles from './Controls.module.scss';
import {Input} from './Input';

export interface ColorInputProps {
  value: Color | null;
  onChange: (value: string) => void;
}

export function ColorInput({value, onChange}: ColorInputProps) {
  const pickerRef = useRef<HTMLDivElement>();
  const [position, setPosition] = useState<{x: number; y: number}>(null);
  const reducedMotion = useReducedMotion();

  useClickOutside(pickerRef, () => {
    if (position) {
      setPosition(null);
    }
  });

  return (
    <>
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
        <ColorPreview
          color={value?.hex() ?? '#00000000'}
          onClick={event => {
            const rect = event.currentTarget.getBoundingClientRect();
            setPosition({
              x: rect.x + 54,
              y: rect.y - 4,
            });
          }}
        />
      </div>
      {position && (
        <ColorPicker
          ref={pickerRef}
          color={value ?? new Color('rgba(0, 0, 0, 0)')}
          onChange={onChange}
          style={{
            left: position.x,
            top: position.y,
          }}
        />
      )}
    </>
  );
}
