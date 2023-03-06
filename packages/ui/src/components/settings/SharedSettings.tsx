import {useApplication} from '../../contexts';
import {useDuration, usePreviewSettings, useSharedSettings} from '../../hooks';
import {ColorInput, Group, Input, Label} from '../controls';
import {Add} from '../icons';
import styles from '../sidebar/Sidebar.module.scss';

export function SharedSettings() {
  const {player, project, meta} = useApplication();
  const duration = useDuration();
  const state = useSharedSettings();
  // We use the preview framerate for all editing purposes.
  const {fps} = usePreviewSettings();

  const startFrame = player.status.secondsToFrames(state.range[0]);
  const endFrame = player.status.secondsToFrames(state.range[1]);

  return (
    <>
      <Group>
        <Label>background</Label>
        <ColorInput
          value={state.background}
          onChange={value => {
            meta.shared.background.set(value ? value : null);
          }}
        />
      </Group>
      <Group>
        <Label>range</Label>
        <Input
          min={0}
          max={endFrame}
          type={'number'}
          value={startFrame}
          onChange={event => {
            let start = parseInt((event.target as HTMLInputElement).value);
            if (isNaN(start)) {
              start = 0;
            }
            meta.shared.range.update(start, endFrame, duration, fps);
          }}
        />
        <Input
          min={startFrame}
          max={duration}
          type={'number'}
          placeholder="end"
          value={endFrame >= Infinity ? '' : endFrame}
          onChange={event => {
            let end = parseInt((event.target as HTMLInputElement).value);
            if (isNaN(end)) {
              end = Infinity;
            }
            meta.shared.range.update(startFrame, end, duration, fps);
          }}
        />
      </Group>
      <Group>
        <Label>resolution</Label>
        <Input
          type="number"
          min={1}
          value={state.size.width}
          onChange={event => {
            const value = parseInt((event.target as HTMLInputElement).value);
            meta.shared.size.set([value, state.size.height]);
          }}
        />
        <Add className={styles.times} />
        <Input
          type="number"
          min={1}
          value={state.size.height}
          onChange={event => {
            const value = parseInt((event.target as HTMLInputElement).value);
            meta.shared.size.set([state.size.width, value]);
          }}
        />
      </Group>{' '}
      {project.audio && (
        <Group>
          <Label>audio offset</Label>
          <Input
            type={'number'}
            value={state.audioOffset.toFixed(4)}
            onChange={event => {
              let audioOffset = parseFloat(
                (event.target as HTMLInputElement).value,
              );
              if (isNaN(audioOffset)) {
                audioOffset = 0;
              }
              meta.shared.audioOffset.set(audioOffset);
            }}
          />
        </Group>
      )}
    </>
  );
}
