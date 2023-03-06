import styles from './Controls.module.scss';
import clsx from 'clsx';
import {ColorPreview} from './ColorPreview';
import {Color} from '@motion-canvas/core/lib/types';

export interface ColorInputProps {
  value: Color | null;
  onChange: (value: string) => void;
}

export function ColorInput({value, onChange}: ColorInputProps) {
  return (
    <div className={clsx(styles.input, styles.color)}>
      <input
        onChange={event => onChange((event.target as HTMLInputElement).value)}
        placeholder="none"
        type="text"
        value={value?.serialize() ?? ''}
      />
      <ColorPreview color={value?.hex() ?? '#00000000'} />
    </div>
  );
}
