import {PlaybackStatus} from '../app';

const playbackStack: PlaybackStatus[] = [];

/**
 * Get a reference to the playback status.
 */
export function usePlayback() {
  const playback = playbackStack.at(-1);
  if (!playback) {
    throw new Error('The playback is not available in the current context.');
  }
  return playback;
}

export function startPlayback(playback: PlaybackStatus) {
  playbackStack.push(playback);
}

export function endPlayback(playback: PlaybackStatus) {
  if (playbackStack.pop() !== playback) {
    throw new Error('startPlayback/endPlayback were called out of order.');
  }
}
