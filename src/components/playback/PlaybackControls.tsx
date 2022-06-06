import styles from './Playback.module.scss';

import {IconType, IconButton, IconCheckbox} from '../controls';
import {useDocumentEvent, usePlayer, usePlayerState} from '../../hooks';
import {Select, Input} from '../controls';
import {Framerate} from './Framerate';
import {useCallback} from 'preact/hooks';
import {classes} from '../../utils';

export function PlaybackControls() {
  const player = usePlayer();
  const state = usePlayerState();

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        switch (event.key) {
          case ' ':
            player.togglePlayback();
            break;
          case 'ArrowLeft':
            player.requestReset();
            break;
          case 'ArrowRight':
            player.requestNextFrame();
            break;
          case 'm':
            player.toggleAudio();
            break;
          case 'l':
            player.toggleLoop();
            break;
        }
      },
      [state],
    ),
  );

  return (
    <div className={classes(styles.controls, [styles.disabled, state.render])}>
      <Select
        options={[
          {value: 0.25, text: 'x0.25'},
          {value: 0.5, text: 'x0.5'},
          {value: 1, text: 'x1'},
          {value: 1.5, text: 'x1.5'},
          {value: 2, text: 'x2'},
        ]}
        value={state.speed}
        onChange={speed => player.setSpeed(speed)}
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
        onChange={() => player.toggleLoop()}
      />
      <Framerate
        render={framerate => (
          <Input size={4} readOnly value={`${framerate} FPS`} />
        )}
      />
    </div>
  );
}
