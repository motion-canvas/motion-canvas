import styles from './Playback.module.scss';

import {IconButton, IconCheckbox} from '../controls';
import {useDocumentEvent, usePlayerState} from '../../hooks';
import {Select, Input} from '../controls';
import {Framerate} from './Framerate';
import {useCallback} from 'preact/hooks';
import {usePlayer} from '../../contexts';
import clsx from 'clsx';
import React from 'react';
import {
  Pause,
  PhotoCamera,
  PlayArrow,
  Repeat,
  SkipNext,
  SkipPrevious,
  VolumeOff,
  VolumeOn,
} from '../icons';

export function PlaybackControls() {
  const player = usePlayer();
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
              player.requestSeek(state.endFrame);
              return;
            }

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
        titleOn="Mute audio"
        titleOff="Unmute audio"
        checked={!state.muted}
        onChange={value => player.toggleAudio(value)}
      >
        {state.muted ? <VolumeOff /> : <VolumeOn />}
      </IconCheckbox>
      <IconButton
        title="Previous frame"
        onClick={() => player.requestPreviousFrame()}
      >
        <SkipPrevious />
      </IconButton>
      <IconCheckbox
        main
        titleOn="Pause"
        titleOff="Play"
        checked={!state.paused}
        onChange={value => player.togglePlayback(value)}
      >
        {state.paused ? <PlayArrow /> : <Pause />}
      </IconCheckbox>
      <IconButton title="Next frame" onClick={() => player.requestNextFrame()}>
        <SkipNext />
      </IconButton>
      <IconCheckbox
        titleOn="Loop video (Enabled)"
        titleOff="Loop video (Disabled)"
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
        onClick={() => player.exportCurrentFrame()}
      >
        <PhotoCamera />
      </IconButton>
    </div>
  );
}
