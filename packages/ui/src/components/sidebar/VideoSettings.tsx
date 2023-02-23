import {useRendererState} from '../../hooks';
import {Button, Group, Label} from '../controls';
import {Pane} from '../tabs';
import {useApplication} from '../../contexts';
import {PreviewSettings, RenderingSettings, SharedSettings} from '../settings';
import {Expandable} from '../fields';
import {RendererState} from '@motion-canvas/core';

export function VideoSettings() {
  const {renderer, project, meta} = useApplication();
  const state = useRendererState();

  return (
    <Pane title="Video Settings" id="settings-pane">
      <Expandable title="General" open>
        <SharedSettings />
      </Expandable>
      <Expandable title="Preview">
        <PreviewSettings />
      </Expandable>
      <Expandable title="Rendering">
        <RenderingSettings />
      </Expandable>
      <Group>
        <Label />
        <Button
          main
          id="render"
          data-rendering={state !== RendererState.Initial}
          onClick={() => {
            if (state === RendererState.Initial) {
              renderer.render({
                ...meta.getFullRenderingSettings(),
                name: project.name,
              });
            } else {
              renderer.abort();
            }
          }}
        >
          {state === RendererState.Initial
            ? 'RENDER'
            : state === RendererState.Working
            ? 'STOP RENDERING'
            : 'ABORTING...'}
        </Button>
      </Group>
    </Pane>
  );
}
