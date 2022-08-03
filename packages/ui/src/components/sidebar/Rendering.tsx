import {usePlayer, usePlayerState, useSubscribable} from '../../hooks';
import {Button, Group, Input, Label, Select} from '../controls';
import {Pane} from '../tabs';
import type {CanvasColorSpace} from '@motion-canvas/core/lib/types';

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

  useSubscribable(
    player.onFrameRendered,
    async ({frame, data}) => {
      try {
        const name = frame.toString().padStart(6, '0');
        await fetch(`/render/frame${name}.png`, {
          method: 'POST',
          body: data,
        });
      } catch (e) {
        console.error(e);
        player.toggleRendering(false);
      }
    },
    [],
  );

  return (
    <Pane title="Rendering">
      <Group>
        <Label>Range</Label>
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
        <Label>FPS</Label>
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
        <Label>Resolution</Label>
        <Input
          type="number"
          min={1}
          value={width}
          onChange={event => {
            const value = parseInt((event.target as HTMLInputElement).value);
            player.project.setSize(value, height);
            player.project.reloadAll();
            player.reload();
          }}
        />
        X
        <Input
          type="number"
          min={1}
          value={height}
          onChange={event => {
            const value = parseInt((event.target as HTMLInputElement).value);
            player.project.setSize(width, value);
            player.project.reloadAll();
            player.reload();
          }}
        />
      </Group>
      <Group>
        <Label>Scale</Label>
        <Select
          options={scales}
          value={state.scale}
          onChange={value => player.setScale(value)}
        />
      </Group>
      <Group>
        <Label>Color Space</Label>
        <Select
          options={colorSpaces}
          value={state.colorSpace}
          onChange={value => player.setColorSpace(value as CanvasColorSpace)}
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
