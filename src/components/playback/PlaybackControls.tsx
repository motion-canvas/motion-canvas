import {Icon, IconButton, IconCheckbox} from '../controls';
import {usePlayer, usePlayerState} from '../../hooks';

interface PlaybackControlsProps {
  className?: string;
}

export function PlaybackControls({className}: PlaybackControlsProps) {
  const player = usePlayer();
  const state = usePlayerState();

  return (
    <div className={className}>
      <IconCheckbox
        id={'audio'}
        iconOn={Icon.volumeOn}
        iconOff={Icon.volumeOff}
        checked={!state.muted}
        onChange={value => player.toggleAudio(value)}
      />
      <IconButton
        icon={Icon.skipPrevious}
        onClick={() => player.requestReset()}
      />
      <IconCheckbox
        id={'play'}
        main
        iconOn={Icon.pause}
        iconOff={Icon.play}
        checked={!state.paused}
        onChange={value => player.togglePlayback(value)}
      />
      <IconButton
        icon={Icon.skipNext}
        onClick={() => player.requestNextFrame()}
      />
      <IconCheckbox
        id={'loop'}
        iconOn={Icon.repeat}
        iconOff={Icon.repeat}
        checked={state.loop}
        onChange={value => player.updateState({loop: value})}
      />
    </div>
  );
}
