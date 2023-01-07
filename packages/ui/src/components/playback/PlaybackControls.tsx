import styles from './Playback.module.scss';

import {IconType, IconButton, IconCheckbox} from '../controls';
import {useDocumentEvent, usePlayerState} from '../../hooks';
import {Select, Input} from '../controls';
import {Framerate} from './Framerate';
import {useCallback} from 'preact/hooks';
import {usePlayer} from '../../contexts';
import clsx from 'clsx';

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
            event.preventDefault();
            if (event.shiftKey) {
              player.requestReset();
              return;
            }

            player.requestPreviousFrame();
            break;
          case 'ArrowRight':
            event.preventDefault();
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
    <div className={clsx(styles.controls, state.render && styles.disabled)}>
      <Select
        title="Playback speed"
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
        titleOn="Mute audio"
        titleOff="Unmute audio"
        checked={!state.muted}
        onChange={value => player.toggleAudio(value)}
      />
      <IconButton
        title="Previous frame"
        icon={IconType.skipPrevious}
        onClick={() => player.requestPreviousFrame()}
      />
      <IconCheckbox
        id={'play'}
        main
        iconOn={IconType.pause}
        iconOff={IconType.play}
        titleOn="Play"
        titleOff="Pause"
        checked={!state.paused}
        onChange={value => player.togglePlayback(value)}
      />
      <IconButton
        title="Next frame"
        icon={IconType.skipNext}
        onClick={() => player.requestNextFrame()}
      />
      <IconCheckbox
        id={'loop'}
        iconOn={IconType.repeat}
        iconOff={IconType.repeat}
        titleOn="Loop video"
        checked={state.loop}
        onChange={() => player.toggleLoop()}
      />
      <Framerate
        render={(framerate, paused) => (
          <Input
            title="Current framerate"
            size={4}
            readOnly
            value={paused ? 'PAUSED' : `${framerate} FPS`}
          />
        )}
      />
      <IconButton
        title="Save snapshot"
        icon={IconType.photoCamera}
        onClick={() => player.exportCurrentFrame()}
      />
    </div>
  );
}
