import {usePlayer, usePlayerState, useSubscribable} from '../../hooks';
import {useMemo} from 'preact/hooks';
import {Button, Group, Input, Label, Select} from '../controls';
import {Pane} from '../tabs';

export function Rendering() {
  const player = usePlayer();
  const state = usePlayerState();
  const {width, height} = player.project.getSize();

  const resolutions = useMemo(() => {
    return [
      {value: 0.5, text: `${width / 2}x${height / 2} (Half)`},
      {value: 1, text: `${width}x${height} (Full)`},
      {value: 2, text: `${width * 2}x${height * 2} (Double)`},
    ];
  }, [width, height]);

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
        <Select
          options={[
            {value: 30, text: '30 FPS'},
            {value: 60, text: '60 FPS'},
          ]}
          value={state.fps}
          onChange={value => player.setFramerate(value)}
        />
      </Group>
      <Group>
        <Label>Resolution</Label>
        <Select
          options={resolutions}
          value={state.scale}
          onChange={value => player.setScale(value)}
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
