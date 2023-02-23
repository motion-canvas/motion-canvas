import {usePreviewSettings} from '../../hooks';
import {Group, InputSelect, Label, Select} from '../controls';
import {useApplication} from '../../contexts';
import {FrameRates, Scales} from './options';

export function PreviewSettings() {
  const {meta} = useApplication();
  const state = usePreviewSettings();

  return (
    <>
      <Group>
        <Label>frame rate</Label>
        <InputSelect
          type="number"
          min={1}
          value={state.fps.toString()}
          onChange={value => {
            meta.preview.fps.set(parseInt(value));
          }}
          options={FrameRates}
        />
      </Group>
      <Group>
        <Label>scale</Label>
        <Select
          options={Scales}
          value={state.resolutionScale}
          onChange={value => meta.preview.resolutionScale.set(value)}
        />
      </Group>
    </>
  );
}
