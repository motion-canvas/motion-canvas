import styles from './Playback.module.scss';

import {useCallback} from 'preact/hooks';
import {useApplication} from '../../contexts';
import {useDocumentEvent, usePlayerState} from '../../hooks';
import {IconButton, IconCheckbox, Input, Select} from '../controls';
import {
  FastForward,
  FastRewind,
  Pause,
  PhotoCamera,
  PlayArrow,
  Repeat,
  SkipNext,
  SkipPrevious,
  VolumeOff,
  VolumeOn,
} from '../icons';
import {Framerate} from './Framerate';

export function PlaybackControls() {
  const {player, renderer, meta, project} = useApplication();
  const state = usePlayerState();

  useDocumentEvent(
    'keydown',
    useCallback(
      event => {
        if (document.activeElement.tagName === 'INPUT') {
          return;
        }
        switch (event.key) {
          case ' ':
            event.preventDefault();
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
            if (event.shiftKey) {
              player.requestSeek(Infinity);
              return;
            }

            player.requestNextFrame();
            break;
          case 'm':
            player.toggleAudio();
            break;
          case 'ArrowUp':
            player.addAudioVolume(0.1);
            break;
          case 'ArrowDown':
            player.addAudioVolume(-0.1);
            break;
          case 'l':
            player.toggleLoop();
            break;
        }
      },
      [player],
    ),
  );

  return (
    <div className={styles.controls}>
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
        titleOn="Mute audio [M]"
        titleOff="Unmute audio [M]"
        checked={!state.muted}
        onChange={value => player.toggleAudio(value)}
      >
        {state.muted ? <VolumeOff /> : <VolumeOn />}
      </IconCheckbox>
      <IconButton
        title="Start [Shift + Left arrow]"
        onClick={() => player.requestReset()}
      >
        <SkipPrevious />
      </IconButton>
      <IconButton
        title="Previous frame [Left arrow]"
        onClick={() => player.requestPreviousFrame()}
      >
        <FastRewind />
      </IconButton>
      <IconCheckbox
        main
        titleOn="Pause [Space]"
        titleOff="Play [Space]"
        checked={!state.paused}
        onChange={value => player.togglePlayback(value)}
      >
        {state.paused ? <PlayArrow /> : <Pause />}
      </IconCheckbox>
      <IconButton
        title="Next frame [Right arrow]"
        onClick={() => player.requestNextFrame()}
      >
        <FastForward />
      </IconButton>
      <IconButton
        title="End [Shift + Right arrow]"
        onClick={() => player.requestSeek(Infinity)}
      >
        <SkipNext />
      </IconButton>
      <IconCheckbox
        titleOn="Disable looping [L]"
        titleOff="Enable looping [L]"
        checked={state.loop}
        onChange={() => player.toggleLoop()}
      >
        <Repeat />
      </IconCheckbox>
      <Framerate
        render={(framerate, paused) => (
          <Input
            title="Current framerate"
            readOnly
            value={paused ? 'PAUSED' : `${framerate} FPS`}
          />
        )}
      />
      <IconButton
        title="Save snapshot"
        onClick={() =>
          renderer.renderFrame(
            {
              ...meta.getFullRenderingSettings(),
              name: project.name,
            },
            player.status.time,
          )
        }
      >
        <PhotoCamera />
      </IconButton>
    </div>
  );
}
