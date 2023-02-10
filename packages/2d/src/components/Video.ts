import {
  Rect as RectType,
  SerializedVector2,
} from '@motion-canvas/core/lib/types';
import {drawImage} from '../utils';
import {computed, initial, signal} from '../decorators';
import {useProject, useThread} from '@motion-canvas/core/lib/utils';
import {PlaybackState} from '@motion-canvas/core';
import {clamp} from '@motion-canvas/core/lib/tweening';
import {Rect, RectProps} from './Rect';
import {Length} from '../partials';
import {
  DependencyContext,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';

export interface VideoProps extends RectProps {
  src?: SignalValue<string>;
  alpha?: SignalValue<number>;
  smoothing?: SignalValue<boolean>;
  time?: SignalValue<number>;
  play?: boolean;
}

export class Video extends Rect {
  private static readonly pool: Record<string, HTMLVideoElement> = {};

  @signal()
  public declare readonly src: SimpleSignal<string, this>;

  @initial(1)
  @signal()
  public declare readonly alpha: SimpleSignal<number, this>;

  @initial(true)
  @signal()
  public declare readonly smoothing: SimpleSignal<boolean, this>;

  @initial(0)
  @signal()
  protected declare readonly time: SimpleSignal<number, this>;

  @initial(false)
  @signal()
  protected declare readonly playing: SimpleSignal<boolean, this>;

  private lastTime = -1;

  public constructor(props: VideoProps) {
    super(props);
  }

  public isPlaying(): boolean {
    return this.playing();
  }

  public getCurrentTime(): number {
    return this.time();
  }

  public getDuration(): number {
    return this.video().duration;
  }

  protected override desiredSize(): SerializedVector2<Length | null> {
    const custom = super.desiredSize();
    if (custom.x === null && custom.y === null) {
      const image = this.video();
      return {
        x: image.videoWidth,
        y: image.videoHeight,
      };
    }

    return custom;
  }

  @computed()
  public completion(): number {
    return this.clampTime(this.time()) / this.video().duration;
  }

  @computed()
  protected video(): HTMLVideoElement {
    const src = this.src();
    const key = `${this.key}/${src}`;
    if (Video.pool[key]) {
      return Video.pool[key];
    }

    const video = document.createElement('video');
    video.src = src;
    if (video.readyState < 2) {
      DependencyContext.collectPromise(
        new Promise<void>(resolve => {
          const listener = () => {
            resolve();
            video.removeEventListener('canplay', listener);
          };
          video.addEventListener('canplay', listener);
        }),
      );
    }
    Video.pool[key] = video;

    return video;
  }

  @computed()
  protected seekedVideo(): HTMLVideoElement {
    const video = this.video();
    const time = this.clampTime(this.time());

    if (!video.paused) {
      video.pause();
    }

    if (this.lastTime === time) {
      return video;
    }

    this.setCurrentTime(time);

    return video;
  }

  @computed()
  protected fastSeekedVideo(): HTMLVideoElement {
    const video = this.video();
    const time = this.clampTime(this.time());
    if (this.lastTime === time) {
      return video;
    }

    const playing = this.playing() && time < video.duration;
    if (playing) {
      if (video.paused) {
        DependencyContext.collectPromise(video.play());
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }

    if (Math.abs(video.currentTime - time) > 0.2) {
      this.setCurrentTime(time);
    } else if (!playing) {
      video.currentTime = time;
    }

    return video;
  }

  protected override draw(context: CanvasRenderingContext2D) {
    this.drawShape(context);
    if (this.clip()) {
      context.clip(this.getPath());
    }

    const alpha = this.alpha();
    if (alpha > 0) {
      const video =
        useProject().playbackState() === PlaybackState.Playing
          ? this.fastSeekedVideo()
          : this.seekedVideo();

      const rect = RectType.fromSizeCentered(this.computedSize());
      context.save();
      if (alpha < 1) {
        context.globalAlpha *= alpha;
      }
      context.imageSmoothingEnabled = this.smoothing();
      drawImage(context, video, rect);
      context.restore();
    }

    this.drawChildren(context);
  }

  protected override applyFlex() {
    super.applyFlex();
    const video = this.video();
    this.element.style.aspectRatio = (
      this.ratio() ?? video.videoWidth / video.videoHeight
    ).toString();
  }

  protected setCurrentTime(value: number) {
    const video = this.video();
    if (video.readyState < 2) return;

    video.currentTime = value;
    this.lastTime = value;
    if (video.seeking) {
      DependencyContext.collectPromise(
        new Promise<void>(resolve => {
          const listener = () => {
            resolve();
            video.removeEventListener('seeked', listener);
          };
          video.addEventListener('seeked', listener);
        }),
      );
    }
  }

  public play() {
    const time = useThread().time;
    const start = time() - this.time();
    this.playing(true);
    this.time(() => this.clampTime(time() - start));
  }

  public pause() {
    this.playing(false);
    this.time.save();
    this.video().pause();
  }

  public seek(time: number) {
    const playing = this.playing();
    this.time(this.clampTime(time));
    if (playing) {
      this.play();
    } else {
      this.pause();
    }
  }

  public clampTime(time: number): number {
    return clamp(0, this.video().duration, time);
  }

  protected override collectAsyncResources() {
    super.collectAsyncResources();
    this.seekedVideo();
  }
}
