import {AudioData} from './AudioData';
import {ValueDispatcher} from '../events';
import {useLogger} from '../utils';

export class AudioManager {
  public get onDataChanged() {
    return this.data.subscribable;
  }
  private readonly data = new ValueDispatcher<AudioData | null>(null);

  public get onOffsetChanged() {
    return this.offset.subscribable;
  }
  private readonly offset = new ValueDispatcher(0);

  private static readonly context = new AudioContext();
  private readonly audioElement: HTMLAudioElement = new Audio();
  private source: string | null = null;
  private error = false;
  private abortController: AbortController | null = null;

  public constructor() {
    if (import.meta.hot) {
      import.meta.hot.on('motion-canvas:assets', ({urls}) => {
        if (this.source && urls.includes(this.source)) {
          this.setSource(this.source);
        }
      });
    }
  }

  public getTime() {
    return this.toAbsoluteTime(this.audioElement.currentTime);
  }

  public setTime(value: number) {
    this.audioElement.currentTime = this.toRelativeTime(value);
  }

  public setOffset(value: number) {
    this.offset.current = value;
  }

  public setMuted(isMuted: boolean) {
    this.audioElement.muted = isMuted;
  }

  public setSource(src: string) {
    this.source = src;
    this.audioElement.src = src;
    this.abortController?.abort();
    this.abortController = new AbortController();
    this.loadData(this.abortController.signal).catch(e => {
      if (e.name !== 'AbortError') {
        useLogger().error(e);
      }
    });
  }

  public isInRange(time: number) {
    return time >= this.offset.current && time < this.audioElement.duration;
  }

  public toRelativeTime(time: number) {
    return Math.max(0, time - this.offset.current);
  }

  public toAbsoluteTime(time: number) {
    return time + this.offset.current;
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
      } else {
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

  private async loadData(signal: AbortSignal) {
    this.data.current = null;
    if (!this.source) {
      return;
    }

    const response = await fetch(this.source, {signal});
    const rawBuffer = await response.arrayBuffer();
    if (signal.aborted) return;
    const audioBuffer = await this.decodeAudioData(rawBuffer);
    if (signal.aborted) return;

    const sampleSize = 256;
    const samples = ~~(audioBuffer.length / sampleSize);

    const peaks = [];
    let absoluteMax = 0;
    for (
      let channelId = 0;
      channelId < audioBuffer.numberOfChannels;
      channelId++
    ) {
      const channel = audioBuffer.getChannelData(channelId);
      for (let i = 0; i < samples; i++) {
        const start = ~~(i * sampleSize);
        const end = ~~(start + sampleSize);

        let min = channel[start];
        let max = min;

        for (let j = start; j < end; j++) {
          const value = channel[j];
          if (value > max) {
            max = value;
          }
          if (value < min) {
            min = value;
          }
        }

        if (channelId === 0 || max > peaks[i * 2]) {
          peaks[i * 2] = max;
        }
        if (channelId === 0 || min < peaks[i * 2 + 1]) {
          peaks[i * 2 + 1] = min;
        }

        if (max > absoluteMax) {
          absoluteMax = max;
        }
        if (Math.abs(min) > absoluteMax) {
          absoluteMax = Math.abs(min);
        }
      }
    }

    this.data.current = {
      peaks,
      absoluteMax,
      length: samples,
      sampleRate: (audioBuffer.sampleRate / sampleSize) * 2,
    };
  }

  private decodeAudioData(buffer: ArrayBuffer): Promise<AudioBuffer> {
    return new Promise<AudioBuffer>((resolve, reject) =>
      AudioManager.context.decodeAudioData(buffer, resolve, reject),
    );
  }
}
