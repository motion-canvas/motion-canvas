import {useEffect, useState} from 'preact/hooks';
import {MouseButton, clamp} from '../../utils';
import styles from './Controls.module.scss';

export interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

export function Slider({value, onChange}: SliderProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div
      className={styles.slider}
      onPointerDown={event => {
        if (event.button === MouseButton.Left) {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);

          const rect = event.currentTarget.getBoundingClientRect();
          // +2 & +4 to account for thumb offset
          const y = event.clientY - rect.y + 2;
          const newInternalValue = 1 - y / (rect.height + 4);
          setInternalValue(clamp(0, 1, newInternalValue));
        }
      }}
      onPointerMove={event => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.stopPropagation();

          const rect = event.currentTarget.getBoundingClientRect();
          // +2 & +4 to account for thumb offset
          const y = event.clientY - rect.y + 2;
          const newInternalValue = 1 - y / (rect.height + 4);
          setInternalValue(clamp(0, 1, newInternalValue));
        }
      }}
      onPointerUp={event => {
        if (event.button === MouseButton.Left) {
          event.stopPropagation();
          event.currentTarget.releasePointerCapture(event.pointerId);

          onChange?.(internalValue);
        }
      }}
    >
      <div className={styles.sliderTrack}>
        <div
          className={styles.sliderProgress}
          style={`height: ${internalValue * 100}%`}
        >
          <div className={styles.sliderThumb} />
        </div>
      </div>
    </div>
  );
}
