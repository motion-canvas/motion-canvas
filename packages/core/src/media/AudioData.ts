export interface AudioData {
  /**
   * An array of minimum and maximum waveform data points, interleaved.
   * Each value is in range of -1 to 1.
   */
  peaks: number[];
  /**
   * The amount of samples taken.
   */
  length: number;
  /**
   * The absolute biggest value from the peaks array.
   */
  absoluteMax: number;
  /**
   * Samples per seconds.
   */
  sampleRate: number;
  /**
   * The duration of the audio in seconds.
   */
  duration: number;
}

export const EMPTY_AUDIO_DATA: AudioData = {
  peaks: [],
  length: 0,
  absoluteMax: 0,
  sampleRate: 0,
  duration: 0,
};
