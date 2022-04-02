import {Project} from '../Project';
import {
  PromiseSimpleEventDispatcher,
  SimpleEventDispatcher,
} from 'strongly-typed-events';

const MINIMUM_ANIMATION_DURATION = 1000;
const MAX_AUDIO_DESYNC = 1 / 50;

export interface PlayerState {
  duration: number;
  frame: number;
  startFrame: number;
  paused: boolean;
  loading: boolean;
  finished: boolean;
  loop: boolean;
  speed: number;
  render: boolean;
}

interface PlayerCommands {
  next: boolean;
  reset: boolean;
  seek: number;
}

export interface PlayerRenderEvent {
  frame: number;
  blob: Blob;
}

export class Player {
  public get StateChanged() {
    return this.stateChanged.asEvent();
  }
  public get RenderChanged() {
    return this.renderChanged.asEvent();
  }
  public readonly project: Project;

  private readonly stateChanged = new SimpleEventDispatcher<PlayerState>();
  private readonly renderChanged =
    new PromiseSimpleEventDispatcher<PlayerRenderEvent>();

  private readonly audio: HTMLAudioElement = null;
  private startTime: number;
  private ignoreAudioEvents = false;

  private state: PlayerState = {
    duration: 100,
    frame: 0,
    startFrame: 0,
    paused: true,
    loading: false,
    finished: false,
    loop: true,
    speed: 1,
    render: false,
  };

  private commands: PlayerCommands = {
    next: false,
    reset: true,
    seek: -1,
  };

  public updateState(newState: Partial<PlayerState>) {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.stateChanged.dispatch(this.state);
  }

  private consumeCommands(): PlayerCommands {
    const commands = {...this.commands};
    this.commands.next = false;
    this.commands.reset = false;
    this.commands.seek = -1;

    return commands;
  }

  public constructor(factory: () => Project, audioSrc?: string) {
    this.project = factory();
    this.startTime = performance.now();

    if (audioSrc) {
      this.audio = new Audio(audioSrc);
      this.audio.addEventListener('durationchange', () => {
        this.updateState({
          duration: this.project.secondsToFrames(this.audio.duration),
        });
        this.requestSeek(this.state.duration);
      });
      this.audio.addEventListener('play', () => {
        if (!this.ignoreAudioEvents) {
          this.updateState({paused: this.audio.paused});
        }
      });
      this.audio.addEventListener('pause', () => {
        if (!this.ignoreAudioEvents) {
          this.updateState({paused: this.audio.paused});
        }
      });
    }

    this.request();
  }

  private async reset(state: PlayerState): Promise<PlayerState> {
    this.project.start();
    state.finished = await this.project.next();
    while (this.project.frame < state.startFrame && !state.finished) {
      state.finished = await this.project.next();
    }
    this.project.draw();
    this.startTime = performance.now();
    if (this.audio) {
      this.audio.currentTime = Math.max(
        0,
        this.project.framesToSeconds(state.startFrame - 3),
      );
    }
    state.frame = this.project.frame;

    this.updateState({
      finished: state.finished,
      frame: state.frame,
    });

    return state;
  }

  public requestNextFrame(): void {
    this.commands.next = true;
  }

  public requestReset(): void {
    this.commands.reset = true;
  }

  public requestSeek(value: number): void {
    this.commands.seek = value;
    if (value < this.state.startFrame) {
      this.updateState({startFrame: value});
    }
  }

  public togglePlayback(value?: boolean): void {
    this.updateState({
      paused: !(value ?? this.state.paused),
    });
  }

  public toggleRendering(value?: boolean): void {
    this.updateState({
      render: !(value ?? this.state.render),
    });
  }

  private async run() {
    let commands = this.consumeCommands();
    let state = {...this.state};
    if (commands.seek >= state.startFrame) {
      state.startFrame = commands.seek;
    }
    if (commands.reset || (commands.seek >= 0 && state.frame > commands.seek)) {
      state = await this.reset(state);
    }

    // rendering
    if (state.render) {
      this.ignoreAudioEvents = true;
      if (!this.audio?.paused) {
        this.audio?.pause();
      }
      state.finished = await this.project.next();
      this.project.draw();
      await this.renderChanged.dispatch({
        frame: this.project.frame,
        blob: await this.getContent(),
      });
      if (state.finished) {
        state.render = false;
      }

      this.updateState({
        finished: state.finished,
        render: state.render,
        frame: this.project.frame,
      });
      this.request();
      this.ignoreAudioEvents = false;
      return;
    }

    // synchronize audio.
    if (state.speed !== 1 && this.audio) {
      this.audio.currentTime = this.project.time;
    }

    // pause / play audio.
    if (this.audio && this.audio.paused !== state.paused) {
      this.ignoreAudioEvents = true;
      if (state.paused) {
        this.audio.pause();
      } else {
        this.audio.currentTime = Math.max(
          0,
          this.project.framesToSeconds(this.project.frame - 3),
        );
        await this.audio.play();
      }
      this.ignoreAudioEvents = false;
    }

    // handle finishing
    if (state.finished) {
      this.updateState({
        duration: this.project.frame,
        finished: state.finished,
      });

      if (state.loop) {
        this.requestReset();
      }

      // Prevent animation from restarting too quickly.
      const animationDuration = performance.now() - this.startTime;
      if (animationDuration < MINIMUM_ANIMATION_DURATION) {
        setTimeout(
          () => this.request(),
          MINIMUM_ANIMATION_DURATION - animationDuration,
        );
      } else {
        this.request();
      }
      return;
    }

    // do nothing if paused or is ahead of the audio.
    if (
      this.project.frame >= state.startFrame &&
      !commands.next &&
      (state.paused ||
        (state.speed === 1 &&
          this.audio &&
          this.audio.currentTime < this.project.time))
    ) {
      this.request();
      return;
    }

    state.finished = await this.project.next(state.speed);

    // Start from certain frame
    if (this.project.frame < state.startFrame) {
      while (this.project.frame < state.startFrame && !state.finished) {
        state.finished = await this.project.next();
      }
      if (this.audio) {
        this.audio.currentTime = this.project.framesToSeconds(
          state.startFrame - 3,
        );
      }
    }

    // Synchronize animation with audio.
    if (
      state.speed === 1 &&
      this.audio?.currentTime - MAX_AUDIO_DESYNC > this.project.time
    ) {
      while (this.audio.currentTime > this.project.time && !state.finished) {
        state.finished = await this.project.next();
      }
    }

    this.project.draw();
    this.updateState({
      finished: state.finished,
      duration: state.duration,
      frame: this.project.frame,
    });
    this.request();
  }

  private request() {
    requestAnimationFrame(async () => {
      try {
        this.updateState({loading: true});
        await this.run();
        this.updateState({loading: false});
      } catch (e) {
        console.error(e);
      }
    });
  }

  private async getContent(): Promise<Blob> {
    return new Promise<Blob>(resolve =>
      this.project.toCanvas().toBlob(resolve, 'image/png'),
    );
  }
}
