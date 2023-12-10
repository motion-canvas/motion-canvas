import type {RangeMetaField} from '@motion-canvas/core';
import {useApplication} from '../../contexts';
import {
  useDuration,
  usePreviewSettings,
  useSubscribableValue,
} from '../../hooks';
import {Input} from '../controls';
import {MetaFieldGroup} from './MetaFieldGroup';

export interface RangeMetaFieldViewProps {
  field: RangeMetaField;
}

export function RangeMetaFieldView({field}: RangeMetaFieldViewProps) {
  const {player} = useApplication();
  const duration = useDuration();
  const range = useSubscribableValue(field.onChanged);
  // We use the preview framerate for all editing purposes.
  const {fps} = usePreviewSettings();

  const startFrame = player.status.secondsToFrames(range[0]);
  const endFrame = player.status.secondsToFrames(range[1]);

  return (
    <MetaFieldGroup field={field}>
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
          field.update(start, endFrame, duration, fps);
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
          field.update(startFrame, end, duration, fps);
        }}
      />
    </MetaFieldGroup>
  );
}
