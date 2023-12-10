import {useCallback, useRef} from 'preact/hooks';
import {useState} from 'react';
import {useDocumentEvent} from '../../hooks';
import {ButtonCheckbox} from '../controls/ButtonCheckbox';
import {Colorize} from '../icons';

export function ColorPicker() {
  return typeof EyeDropper === 'function' ? <ColorPickerImpl /> : <></>;
}

function ColorPickerImpl() {
  const [active, setActive] = useState(false);
  const isActive = useRef(active);
  const pickColor = useCallback(async () => {
    if (isActive.current) return;

    try {
      isActive.current = true;
      setActive(true);
      const dropper = new EyeDropper();
      const {sRGBHex} = await dropper.open();
      await window.navigator.clipboard.writeText(sRGBHex);
    } catch (_) {
      // User canceled the operation.
    }

    isActive.current = false;
    setActive(false);
  }, []);

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        if (document.activeElement.tagName !== 'INPUT' && event.key === 'i') {
          pickColor();
        }
      },
      [pickColor],
    ),
  );

  return (
    <ButtonCheckbox
      title={'Use color picker [I]'}
      checked={active}
      onClick={pickColor}
    >
      <Colorize />
    </ButtonCheckbox>
  );
}
