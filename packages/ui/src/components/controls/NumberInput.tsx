import clsx from 'clsx';
import type {JSX} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';
import {MouseButton, clamp} from '../../utils';
import styles from './Controls.module.scss';

type NumberInputProps = Omit<
  JSX.HTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'min' | 'max' | 'step' | 'label'
> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decimalPlaces?: number;
  label?: string;
};

export function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  decimalPlaces = 0,
  label = null,
  ...props
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>();
  const [currentValue, setCurrentValue] = useState(value);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <>
      <input
        type={'number'}
        ref={inputRef}
        min={min}
        max={max}
        step={step}
        lang={'en'}
        value={currentValue?.toFixed(decimalPlaces)}
        onChangeCapture={() => onChange?.(parseFloat(inputRef.current.value))}
        onPointerDown={event => {
          if (
            document.activeElement !== inputRef.current &&
            event.button === MouseButton.Left
          ) {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);

            setStartX(event.clientX);
          }
        }}
        onPointerMove={event => {
          if (
            document.activeElement !== inputRef.current &&
            event.currentTarget.hasPointerCapture(event.pointerId)
          ) {
            event.preventDefault();
            event.stopPropagation();

            if (Math.abs(startX - event.clientX) > 5) {
              inputRef.current.requestPointerLock();
            }
          } else if (document.pointerLockElement === inputRef.current) {
            setCurrentValue(value => {
              // ignore very large jumps in movement, as they often result
              // from mouse acceleration issues
              if (Math.abs(event.movementX) > 100) {
                return value;
              }

              return clamp(min, max, value + event.movementX * step);
            });
          }
        }}
        onPointerUp={event => {
          if (event.button === MouseButton.Left) {
            event.stopPropagation();
            event.currentTarget.releasePointerCapture(event.pointerId);

            if (document.pointerLockElement === inputRef.current) {
              document.exitPointerLock();
              onChange?.(currentValue);
            } else if (document.activeElement !== inputRef.current) {
              inputRef.current.select();
            }
          }
        }}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            inputRef.current.blur();
          }
          if (event.key === 'Escape') {
            inputRef.current.value = currentValue.toString();
            inputRef.current.blur();
          }
        }}
        className={clsx(styles.input, styles.numberInput)}
        {...props}
      />
      {label && (
        <div className={styles.numberInputLabel}>
          <div>{label}</div>
        </div>
      )}
    </>
  );
}
