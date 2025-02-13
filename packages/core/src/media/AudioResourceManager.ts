import {Logger} from '../app';
import {ValueDispatcher} from '../events';
import {AudioData, EMPTY_AUDIO_DATA} from './AudioData';

export class AudioResourceManager {
  private readonly context = new AudioContext();
  private readonly lookup = new Map<string, AudioResource>();

  public constructor(private readonly logger: Logger) {
    if (import.meta.hot) {
      import.meta.hot.on('motion-canvas:assets', ({urls}) => {
        for (const url of urls) {
          const manager = this.lookup.get(url);
          manager?.reload();
        }
      });
    }
  }

  public peekDuration(source: string): number {
    return this.get(source).onData.current.duration;
  }

  public get(source: string): AudioResource {
    let manager = this.lookup.get(source);
    if (!manager) {
      manager = new AudioResource(this.logger, source, this.context);
      this.lookup.set(source, manager);
    }

    return manager;
  }
}

export class AudioResource {
  public get onData() {
    return this.data.subscribable;
  }
  private readonly data = new ValueDispatcher<AudioData>(EMPTY_AUDIO_DATA);
  private abort: AbortController | null = null;

  public constructor(
    private readonly logger: Logger,
    private readonly source: string,
    private readonly context: AudioContext,
  ) {
    this.reload();
  }

  public async reload() {
    this.abort?.abort();
    const abort = new AbortController();
    this.abort = abort;
    const data = await this.loadData(abort.signal);
    if (!abort.signal.aborted) {
      this.data.current = data ?? EMPTY_AUDIO_DATA;
    }
  }

  private async loadData(signal: AbortSignal): Promise<AudioData | void> {
    let response: Response;
    try {
      response = await fetch(this.source, {signal});
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        this.logger.error(e);
      }
      return;
    }

    const rawBuffer = await response.arrayBuffer();
    if (signal.aborted) {
      return;
    }

    let audioBuffer: AudioBuffer;
    try {
      audioBuffer = await this.decodeAudioData(rawBuffer);
    } catch (e) {
      return;
    }

    if (signal.aborted) {
      return;
    }

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

    return {
      peaks,
      absoluteMax,
      length: samples,
      sampleRate: (audioBuffer.sampleRate / sampleSize) * 2,
      duration: audioBuffer.duration,
    };
  }

  private decodeAudioData(buffer: ArrayBuffer): Promise<AudioBuffer> {
    return new Promise<AudioBuffer>((resolve, reject) =>
      this.context.decodeAudioData(buffer, resolve, reject).catch(reject),
    );
  }
}
