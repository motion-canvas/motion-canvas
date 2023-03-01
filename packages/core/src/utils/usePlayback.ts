import {PlaybackStatus} from '../app';

const PlaybackStack: PlaybackStatus[] = [];

/**
 * Get a reference to the playback status.
 */
export function usePlayback() {
  const playback = PlaybackStack.at(-1);
  if (!playback) {
    throw new Error('The playback is not available in the current context.');
  }
  return playback;
}

export function startPlayback(playback: PlaybackStatus) {
  PlaybackStack.push(playback);
}

export function endPlayback(playback: PlaybackStatus) {
  if (PlaybackStack.pop() !== playback) {
    throw new Error('startPlayback/endPlayback were called out of order.');
  }
}
