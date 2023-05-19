import {Colorize} from '../icons';
import {useState} from 'react';
import {ButtonCheckbox} from '../controls/ButtonCheckbox';
import {useCallback} from 'preact/hooks';
import {useDocumentEvent} from '../../hooks';

export function ColorPicker() {
  return typeof EyeDropper === 'function' ? <ColorPickerImpl /> : <></>;
}

function ColorPickerImpl() {
  const [active, setActive] = useState(false);
  const pickColor = useCallback(async () => {
    try {
      setActive(true);
      const dropper = new EyeDropper();
      const {sRGBHex} = await dropper.open();
      await window.navigator.clipboard.writeText(sRGBHex);
    } catch (_) {
      // User canceled the operation.
    }
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
