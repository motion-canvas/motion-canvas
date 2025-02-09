import {Logger} from '../app';
import {Sound} from '../scenes';
import {useLogger} from '../utils';

export class AudioManager {
  private readonly audioElement: HTMLAudioElement = new Audio();
  private source: string | null = null;
  private error = false;
  private offset = 0;
  private start?: number;
  private duration?: number;
  private gainNode?: GainNode;
  private sourceNode?: MediaElementAudioSourceNode;

  public constructor(
    private readonly logger: Logger,
    private readonly context: AudioContext,
  ) {
    if (import.meta.hot) {
      import.meta.hot.on('motion-canvas:assets', ({urls}) => {
        if (this.source && urls.includes(this.source)) {
          this.setSource(this.source);
        }
      });
    }
  }

  public setSound(sound: Sound) {
    this.setOffset(sound.offset);
    this.setTrim(sound.start, sound.end);
    this.setSource(sound.audio);

    if (this.gainNode === undefined) {
      this.sourceNode = this.context.createMediaElementSource(
        this.audioElement,
      );
      this.gainNode = this.context.createGain();
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
    }

    this.gainNode.gain.value = Math.pow(10, (sound.gain ?? 0) / 10);
    this.setPlaybackRate(sound.realPlaybackRate, true);
  }

  public getTime() {
    return this.toAbsoluteTime(this.audioElement.currentTime);
  }

  public setTime(value: number) {
    this.audioElement.currentTime = this.toRelativeTime(value);
  }

  public setTrim(start?: number, end?: number) {
    this.start = start;
    if (end !== undefined) {
      this.duration = end - (start ?? 0);
    } else {
      this.duration = undefined;
    }
  }

  public setOffset(value: number) {
    this.offset = value;
  }

  public setPlaybackRate(value: number, pitchShift: boolean = false) {
    this.audioElement.playbackRate = value;
    this.audioElement.preservesPitch = !pitchShift;
  }

  public setMuted(isMuted: boolean) {
    this.audioElement.muted = isMuted;
  }

  public setVolume(volume: number) {
    this.audioElement.volume = volume;
  }

  public getSource() {
    return this.source;
  }

  public setSource(src: string) {
    this.source = src;
    this.audioElement.src = src;
  }

  public isInRange(time: number) {
    return (
      time >= this.offset &&
      time <
        this.offset +
          (this.duration ??
            this.audioElement.duration * this.audioElement.playbackRate)
    );
  }

  public toRelativeTime(time: number) {
    return (
      Math.max(0, time - this.offset) * this.audioElement.playbackRate +
      (this.start ?? 0)
    );
  }

  public toAbsoluteTime(time: number) {
    return (
      (time - (this.start ?? 0)) / this.audioElement.playbackRate + this.offset
    );
  }

  public isReady() {
    return this.source && !this.error;
  }

  /**
   * Pause/resume the audio.
   *
   * @param isPaused - Whether the audio should be paused or resumed.
   *
   * @returns `true` if the audio successfully started playing.
   */
  public async setPaused(isPaused: boolean): Promise<boolean> {
    if (this.source && this.audioElement.paused !== isPaused) {
      if (isPaused) {
        this.audioElement.pause();
      } else if (this.audioElement.currentTime < this.audioElement.duration) {
        try {
          await this.audioElement.play();
          this.error = false;
          return true;
        } catch (e: any) {
          if (!this.error) {
            useLogger().error(e);
          }
          this.error = true;
        }
      }
    }

    return false;
  }

  public dispose() {
    this.audioElement.pause();
    this.audioElement.src = '';
    this.audioElement.load();
    this.gainNode?.disconnect();
    this.sourceNode?.disconnect();

    this.sourceNode = undefined;
    this.gainNode = undefined;
  }
}
