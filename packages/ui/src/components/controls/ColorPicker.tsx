import {JSX, Ref} from 'preact';

import {Color} from '@motion-canvas/core';
import {hsv} from 'chroma-js';
import {forwardRef} from 'preact/compat';
import {useEffect, useRef, useState} from 'preact/hooks';
import {useSize} from '../../hooks';
import {MouseButton, clamp} from '../../utils';
import styles from './Controls.module.scss';
import {NumberInput} from './NumberInput';

type ColorPickerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  color: Color;
  onChange: (value: string) => void;
};

function ColorPickerInternal(
  {color, onChange, ...props}: ColorPickerProps,
  ref: Ref<HTMLDivElement>,
) {
  const saturationRef = useRef<HTMLDivElement>();
  const hueRef = useRef<HTMLDivElement>();
  const saturationRect = useSize(saturationRef);
  const hueRect = useSize(hueRef);

  const [hue, setHue] = useState(
    isNaN(color.hsv()[0]) ? 0 : color.hsv()[0] / 360,
  );
  const [saturation, setSaturation] = useState(color.hsv()[1]);
  const [value, setValue] = useState(color.hsv()[2]);
  const [alpha, setAlpha] = useState(color.alpha());

  useEffect(() => {
    onChange(
      hsv(hue * 360, saturation, value)
        .alpha(alpha)
        .hex(),
    );
  }, [hue, saturation, value, alpha]);

  return (
    <div ref={ref} className={styles.colorPicker} {...props}>
      <div
        ref={saturationRef}
        className={styles.saturation}
        style={{backgroundColor: hsv(hue * 360, 1, 1).hex()}}
        onPointerDown={event => {
          if (event.button === MouseButton.Left) {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);

            const x = event.clientX - saturationRect.left;
            const y = event.clientY - saturationRect.top;
            const s = x / saturationRect.width;
            const v = 1 - y / saturationRect.height;
            setSaturation(clamp(0, 1, s));
            setValue(clamp(0, 1, v));
          }
        }}
        onPointerMove={event => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            const x = event.clientX - saturationRect.left;
            const y = event.clientY - saturationRect.top;
            const s = x / saturationRect.width;
            const v = 1 - y / saturationRect.height;
            setSaturation(clamp(0, 1, s));
            setValue(clamp(0, 1, v));
          }
        }}
      >
        <div
          class={styles.slider}
          style={{
            top: `calc(${(1 - value) * 100}% - 6px)`,
            left: `calc(${saturation * 100}% - 6px)`,
            backgroundColor: color.hex(),
          }}
        />
      </div>
      <div
        ref={hueRef}
        className={styles.hue}
        onPointerDown={event => {
          if (event.button === MouseButton.Left) {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);

            const x = event.clientX - hueRect.left;
            const h = x / hueRect.width;
            setHue(clamp(0, 1, h));
          }
        }}
        onPointerMove={event => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            const x = event.clientX - hueRect.left;
            const h = x / hueRect.width;
            setHue(clamp(0, 1, h));
          }
        }}
      >
        <div
          class={styles.slider}
          style={{
            top: 6,
            left: `calc(${hue * 100}% - 6px)`,
            backgroundColor: hsv(hue * 360, 1, 1).hex(),
          }}
        />
      </div>

      <NumberInput
        value={hue}
        onChange={h => setHue(clamp(0, 1, h))}
        min={0}
        max={1}
        step={0.005}
        decimalPlaces={4}
        label={'H'}
      />

      <NumberInput
        value={saturation}
        onChange={s => setSaturation(clamp(0, 1, s))}
        min={0}
        max={1}
        step={0.005}
        decimalPlaces={4}
        label={'S'}
      />

      <NumberInput
        value={value}
        onChange={v => setValue(clamp(0, 1, v))}
        min={0}
        max={1}
        step={0.005}
        decimalPlaces={4}
        label={'V'}
      />

      <NumberInput
        value={alpha}
        onChange={a => setAlpha(clamp(0, 1, a))}
        min={0}
        max={1}
        step={0.005}
        decimalPlaces={4}
        label={'A'}
      />
    </div>
  );
}

export const ColorPicker = forwardRef(ColorPickerInternal);
