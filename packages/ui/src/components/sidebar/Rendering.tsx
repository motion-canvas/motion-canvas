import {usePlayerState} from '../../hooks';
import {Button, Group, Input, Label, Select} from '../controls';
import {Pane} from '../tabs';
import {usePlayer} from '../../contexts';
import type {
  CanvasColorSpace,
  CanvasOutputMimeType,
} from '@motion-canvas/core/lib/types';

export function Rendering() {
  const player = usePlayer();
  const state = usePlayerState();
  const {width, height} = player.project.getSize();

  const scales = [
    {value: 0.5, text: `0.5x (Half)`},
    {value: 1, text: `1.0x (Full)`},
    {value: 2, text: `2.0x (Double)`},
  ];

  const colorSpaces = [
    {value: 'srgb', text: 'sRGB'},
    {value: 'display-p3', text: 'DCI-P3'},
  ];

  const fileTypes = [
    {value: 'image/png', text: 'png'},
    {value: 'image/jpeg', text: 'jpeg'},
    {value: 'image/webp', text: 'webp'},
  ];

  return (
    <Pane title="Rendering">
      <Group>
        <Label>range</Label>
        <Input
          min={0}
          max={state.endFrame}
          type={'number'}
          value={state.startFrame}
          onChange={event => {
            player.setRange(parseInt((event.target as HTMLInputElement).value));
          }}
        />
        <Input
          min={state.startFrame}
          max={state.duration}
          type={'number'}
          value={Math.min(state.duration, state.endFrame)}
          onChange={event => {
            const value = parseInt((event.target as HTMLInputElement).value);
            player.setRange(undefined, value);
          }}
        />
      </Group>
      <Group>
        <Label>frame rate</Label>
        <Input
          type="number"
          min={1}
          value={state.fps}
          onChange={event => {
            const value = parseInt((event.target as HTMLInputElement).value);
            player.setFramerate(value);
          }}
        />
      </Group>
      <Group>
        <Label>resolution</Label>
        <Input
          type="number"
          min={1}
          value={width}
          onChange={event => {
            const value = parseInt((event.target as HTMLInputElement).value);
            player.project.setSize(value, height);
          }}
        />
        x
        <Input
          type="number"
          min={1}
          value={height}
          onChange={event => {
            const value = parseInt((event.target as HTMLInputElement).value);
            player.project.setSize(width, value);
          }}
        />
      </Group>
      <Group>
        <Label>scale</Label>
        <Select
          options={scales}
          value={state.scale}
          onChange={value => player.setScale(value)}
        />
      </Group>
      <Group>
        <Label>color space</Label>
        <Select
          options={colorSpaces}
          value={state.colorSpace}
          onChange={value => player.setColorSpace(value as CanvasColorSpace)}
        />
      </Group>
      <Group>
        <Label>file type</Label>
        <Select
          options={fileTypes}
          value={state.fileType}
          onChange={value => player.setFileType(value as CanvasOutputMimeType)}
        />
      </Group>
      <Group>
        <Label>quality</Label>
        <Input
          type="number"
          min={0}
          max={1}
          value={state.quality}
          onChange={event => {
            const value = parseFloat((event.target as HTMLInputElement).value);
            player.setQuality(value);
          }}
        />
      </Group>
      <Group>
        <Label />
        <Button main onClick={() => player.toggleRendering()}>
          {state.render ? 'STOP RENDERING' : 'RENDER'}
        </Button>
      </Group>
    </Pane>
  );
}
