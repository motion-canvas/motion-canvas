import {useRendererState, useStorage} from '../../hooks';
import {Button, ButtonSelect, Group, Label} from '../controls';
import {Pane} from '../tabs';
import {useApplication} from '../../contexts';
import {Expandable} from '../fields';
import {RendererState} from '@motion-canvas/core';
import {MetaFieldView} from '../meta';
import {openOutputPath} from '../../utils';

export function VideoSettings() {
  const {meta} = useApplication();
  const [processId, setProcess] = useStorage('main-action', 0);

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
        <ProcessButton processId={processId} setProcess={setProcess} />
      </Group>
      {processId === 0 && (
        <Group>
          <Label />
          <Button
            title="Reveal the output directory in file explorer"
            onClick={openOutputPath}
          >
            Output Directory
          </Button>
        </Group>
      )}
    </Pane>
  );
}

interface ProcessButtonProps {
  processId: number;
  setProcess: (id: number) => void;
}

function ProcessButton({processId, setProcess}: ProcessButtonProps) {
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
          text: 'Render',
        },
        {value: 1, text: 'Present'},
      ]}
    />
  ) : (
    <Button
      main
      loading
      id="render"
      data-rendering={true}
      disabled={rendererState === RendererState.Aborting}
      onClick={() => {
        renderer.abort();
      }}
    >
      {rendererState === RendererState.Working ? 'Abort' : 'Aborting'}
    </Button>
  );
}
