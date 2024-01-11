import clsx from 'clsx';
import type {JSX} from 'preact';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import {useDocumentEvent} from '../../hooks';
import {MouseButton, clamp} from '../../utils';
import styles from './Controls.module.scss';

type NumberInputProps = Omit<
  JSX.HTMLAttributes<HTMLInputElement>,
  'min' | 'max' | 'step' | 'value' | 'onChange' | 'onChangeCapture'
> & {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange?: (value: number) => void;
  onChangeCapture?: (value: number) => void;
};

export function NumberInput({
  min = -Infinity,
  max = Infinity,
  step = 1,
  value = 0,
  onChange,
  onChangeCapture,
  ...props
}: NumberInputProps) {
  const handleChange = onChangeCapture ? onChange : undefined;
  const handleChangeCapture = onChangeCapture ?? onChange;

  const inputRef = useRef<HTMLInputElement>();
  const [currentValue, setCurrentValue] = useState(value);
  const [active, setActive] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleDrag = useCallback(
    (event: MouseEvent) => {
      setCurrentValue(value => {
        // ignore very large jumps in movement, as they often result from
        // mouse acceleration issues
        if (Math.abs(event.movementX) > 100) {
          return value;
        }

        const newValue = clamp(min, max, value + event.movementX * step);
        handleChange?.(newValue);
        return newValue;
      });
    },
    [min, max, step],
  );

  useDocumentEvent('pointerlockchange', () => {
    if (document.pointerLockElement === inputRef.current) {
      document.addEventListener('pointermove', handleDrag);
    } else {
      document.removeEventListener('pointermove', handleDrag);
    }
  });

  return (
    <input
      type={'number'}
      ref={inputRef}
      min={min}
      max={max}
      step={step}
      value={currentValue}
      onChangeCapture={event => {
        const value = parseInt((event.target as HTMLInputElement).value);
        handleChangeCapture?.(value);
      }}
      onChange={event => {
        const value = parseInt((event.target as HTMLInputElement).value);
        console.log(value);

        handleChange?.(value);
      }}
      onPointerDown={event => {
        if (!active && event.button === MouseButton.Left) {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);

          setStartX(event.clientX);
        }
      }}
      onPointerMove={event => {
        if (!active && event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.preventDefault();
          event.stopPropagation();

          if (Math.abs(startX - event.clientX) > 5) {
            inputRef.current.requestPointerLock();
          }
        }
      }}
      onPointerUp={event => {
        if (event.button === MouseButton.Left) {
          event.stopPropagation();
          event.currentTarget.releasePointerCapture(event.pointerId);

          if (document.pointerLockElement === inputRef.current) {
            document.exitPointerLock();
            handleChangeCapture?.(currentValue);
          } else if (!active) {
            inputRef.current.select();
          }
        }
      }}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={clsx(
        styles.input,
        styles.numberInput,
        active && styles.active,
      )}
      {...props}
    />
  );
}
