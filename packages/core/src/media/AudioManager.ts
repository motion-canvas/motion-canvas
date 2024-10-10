import {Logger} from '../app';
import {ValueDispatcher} from '../events';
import {Sound} from '../scenes';
import {useLogger} from '../utils';
import {AudioData} from './AudioData';

export class AudioManager {
  public get onDataChanged() {
    return this.data.subscribable;
  }
  private readonly data = new ValueDispatcher<AudioData | null>(null);

  private readonly context = new AudioContext();
  private readonly audioElement: HTMLAudioElement = new Audio();
  private source: string | null = null;
  private error = false;
  private abortController: AbortController | null = null;
  private offset = 0;
  private start?: number;
  private duration?: number;
  private gainNode?: GainNode;

  public constructor(private readonly logger: Logger) {
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
      const sourceNode = this.context.createMediaElementSource(
        this.audioElement,
      );
      this.gainNode = this.context.createGain();
      sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
    }

    this.gainNode.gain.value = Math.pow(10, (sound.gain ?? 0) / 10);
    this.setPlaybackRate(
      Math.pow(2, (sound.detune ?? 0) / 1200) * (sound.playbackRate ?? 1),
      true,
    );
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

  public setSource(src: string) {
    this.source = src;
    this.audioElement.src = src;
    this.abortController?.abort();
    this.abortController = new AbortController();
    this.loadData(this.abortController.signal).catch(e => {
      if (e.name !== 'AbortError') {
        this.logger.error(e);
      }
    });
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
      Math.max(0, time - this.offset + (this.start ?? 0)) *
      this.audioElement.playbackRate
    );
  }

  public toAbsoluteTime(time: number) {
    return (
      time / this.audioElement.playbackRate + this.offset - (this.start ?? 0)
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

  private async loadData(signal: AbortSignal) {
    this.data.current = null;
    if (!this.source) {
      return;
    }

    const response = await fetch(this.source, {signal});
    const rawBuffer = await response.arrayBuffer();
    if (signal.aborted) return;
    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await this.decodeAudioData(rawBuffer);
    } catch (e) {
      return;
    }
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
      this.context.decodeAudioData(buffer, resolve, reject).catch(reject),
    );
  }
}
