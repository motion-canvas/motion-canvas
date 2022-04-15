import styles from './Playback.module.scss';

import {IconType, IconButton, IconCheckbox} from '../controls';
import {usePlayer, usePlayerState} from '../../hooks';
import {Select} from '../controls/Select';
import {Input} from '../controls/Input';
import {Framerate} from './Framerate';

export function PlaybackControls() {
  const player = usePlayer();
  const state = usePlayerState();

  return (
    <div className={styles.controls}>
      <Select
        options={[
          {value: 0.25, text: 'x0.25'},
          {value: 0.5, text: 'x0.5'},
          {value: 1, text: 'x1'},
          {value: 1.5, text: 'x1.5'},
          {value: 2, text: 'x2'},
        ]}
        value={state.speed}
        onChange={speed => player.updateState({speed})}
      />
      <IconCheckbox
        id={'audio'}
        iconOn={IconType.volumeOn}
        iconOff={IconType.volumeOff}
        checked={!state.muted}
        onChange={value => player.toggleAudio(value)}
      />
      <IconButton
        icon={IconType.skipPrevious}
        onClick={() => player.requestReset()}
      />
      <IconCheckbox
        id={'play'}
        main
        iconOn={IconType.pause}
        iconOff={IconType.play}
        checked={!state.paused}
        onChange={value => player.togglePlayback(value)}
      />
      <IconButton
        icon={IconType.skipNext}
        onClick={() => player.requestNextFrame()}
      />
      <IconCheckbox
        id={'loop'}
        iconOn={IconType.repeat}
        iconOff={IconType.repeat}
        checked={state.loop}
        onChange={value => player.updateState({loop: value})}
      />
      <Framerate
        render={framerate => (
          <Input size={4} readOnly value={`${framerate} FPS`} />
        )}
      />
    </div>
  );
}
