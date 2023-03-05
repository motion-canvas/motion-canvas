import {useRenderingSettings} from '../../hooks';
import {Group, Input, InputSelect, Label, Select} from '../controls';
import {useApplication} from '../../contexts';
import type {
  CanvasColorSpace,
  CanvasOutputMimeType,
} from '@motion-canvas/core/lib/types';
import {ColorSpaces, FileTypes, FrameRates, Scales} from './options';

export function RenderingSettings() {
  const {meta} = useApplication();
  const state = useRenderingSettings();

  return (
    <>
      <Group>
        <Label>frame rate</Label>
        <InputSelect
          type="number"
          min={1}
          value={state.fps.toString()}
          onChange={value => {
            meta.rendering.fps.set(parseInt(value));
          }}
          options={FrameRates}
        />
      </Group>
      <Group>
        <Label>scale</Label>
        <Select
          options={Scales}
          value={state.resolutionScale}
          onChange={value => meta.rendering.resolutionScale.set(value)}
        />
      </Group>
      <Group>
        <Label>color space</Label>
        <Select
          options={ColorSpaces}
          value={state.colorSpace}
          onChange={value =>
            meta.rendering.colorSpace.set(value as CanvasColorSpace)
          }
        />
      </Group>
      <Group>
        <Label>file type</Label>
        <Select
          options={FileTypes}
          value={state.fileType}
          onChange={value =>
            meta.rendering.fileType.set(value as CanvasOutputMimeType)
          }
        />
      </Group>
      {state.fileType !== 'image/png' && (
        <Group>
          <Label>quality (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={state.quality * 100}
            onChange={event => {
              meta.rendering.quality.set(
                parseFloat((event.target as HTMLInputElement).value) / 100,
              );
            }}
          />
        </Group>
      )}
      <Group>
        <Label>{meta.rendering.groupByScene.name}</Label>
        <Input
          type="checkbox"
          checked={Boolean(state.groupByScene)}
          onChange={() => {
            meta.rendering.groupByScene.set(!state.groupByScene);
          }}
        />
      </Group>
    </>
  );
}
