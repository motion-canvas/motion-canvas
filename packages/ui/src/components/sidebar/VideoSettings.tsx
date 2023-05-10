import {useRendererState, useStorage} from '../../hooks';
import {Button, ButtonSelect, Group, Label} from '../controls';
import {Pane} from '../tabs';
import {useApplication} from '../../contexts';
import {Expandable} from '../fields';
import {RendererState} from '@motion-canvas/core';
import {MetaFieldView} from '../meta';

export function VideoSettings() {
  const {meta} = useApplication();

  return (
    <Pane title="Video Settings" id="settings-pane">
      <Expandable title={meta.shared.name} open>
        <MetaFieldView field={meta.shared} />
      </Expandable>
      <Expandable title={meta.preview.name}>
        <MetaFieldView field={meta.preview} />
      </Expandable>
      <Expandable title={meta.rendering.name}>
        <MetaFieldView field={meta.rendering} />
      </Expandable>
      <Group>
        <Label />
        <ProcessButton />
      </Group>
    </Pane>
  );
}

function ProcessButton() {
  const [processId, setProcess] = useStorage('main-action', 0);
  const {renderer, presenter, meta, project} = useApplication();
  const rendererState = useRendererState();

  return rendererState === RendererState.Initial ? (
    <ButtonSelect
      main
      id="render"
      value={processId}
      onChange={setProcess}
      onClick={() => {
        if (processId === 0) {
          renderer.render({
            ...meta.getFullRenderingSettings(),
            name: project.name,
          });
        } else {
          presenter.present({
            ...meta.getFullRenderingSettings(),
            name: project.name,
            slide: null,
          });
        }
      }}
      options={[
        {
          value: 0,
          text: 'RENDER',
        },
        {value: 1, text: 'PRESENT'},
      ]}
    />
  ) : (
    <Button
      main
      id="render"
      data-rendering={true}
      disabled={rendererState === RendererState.Aborting}
      onClick={() => {
        renderer.abort();
      }}
    >
      {rendererState === RendererState.Working ? 'ABORT' : 'ABORTING'}
    </Button>
  );
}
