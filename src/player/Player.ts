import {Project} from '../Project';
import {Controls} from './Controls';
import {ThreadsMonitor} from './ThreadsMonitor';

const MINIMUM_ANIMATION_DURATION = 1000;
const MAX_AUDIO_DESYNC = 1 / 50;

export class Player {
  private readonly controls = new Controls(
    <HTMLFormElement>document.getElementById('controls'),
  );
  private readonly threads = new ThreadsMonitor(
    <HTMLElement>document.getElementById('ui'),
  );
  private readonly project: Project;
  private readonly audio: HTMLAudioElement = null;

  private startTime: number;
  private finished: boolean;

  public constructor(factory: () => Project, audioSrc?: string) {
    this.project = factory();
    this.startTime = performance.now();
    this.finished = false;
    this.project.threadsCallback = this.threads.render.bind(this.threads);

    if (audioSrc) {
      this.audio = new Audio(audioSrc);
    }

    this.reset()
      .then(() => this.request())
      .catch(console.error);
  }

  private async reset() {
    this.project.start();
    this.finished = await this.project.next();
    while (this.project.frame < this.controls.startFrom && !this.finished) {
      this.finished = await this.project.next();
    }
    this.project.draw();
    this.controls.onReset();
    this.controls.onFrame(this.project.frame);
    this.startTime = performance.now();
    if (this.audio) {
      this.audio.currentTime = 0;
    }
  }

  private async run() {
    const {isPlaying, shouldReset} = this.controls.consumeState();

    if (shouldReset) {
      await this.reset();
    }

    if (this.controls.isRendering) {
      if (!this.audio?.paused) {
        this.audio?.pause();
      }
      this.finished = await this.project.next();
      this.project.draw();
      await this.controls.onRender(this.project.frame, await this.getContent());
      if (this.finished) {
        await this.controls.toggleRendering(false);
      }

      this.request();
      return;
    }

    if (this.controls.playbackSpeed !== 1 && this.audio) {
      this.audio.currentTime = this.project.time;
    } else if (isPlaying) {
      if (this.audio?.paused) {
        await this.audio?.play();
      }
    } else {
      if (!this.audio?.paused) {
        this.audio?.pause();
      }
    }

    if (
      !isPlaying ||
      (this.controls.playbackSpeed === 1 &&
        this.audio &&
        this.audio.currentTime < this.project.time)
    ) {
      this.request();
      return;
    }

    if (this.finished) {
      if (this.controls.isLooping) {
        // Prevent animation from restarting too quickly.
        const animationDuration = performance.now() - this.startTime;
        if (animationDuration < MINIMUM_ANIMATION_DURATION) {
          setTimeout(
            () => this.run(),
            MINIMUM_ANIMATION_DURATION - animationDuration,
          );
          return;
        }
        await this.reset();
      } else {
        this.request();
        return;
      }
    }

    this.finished = await this.project.next(this.controls.playbackSpeed);

    // Start from certain frame
    while (this.project.frame < this.controls.startFrom && !this.finished) {
      this.finished = await this.project.next();
    }

    // Synchronize animation with audio.
    if (
      this.controls.playbackSpeed === 1 &&
      this.audio?.currentTime - MAX_AUDIO_DESYNC > this.project.time
    ) {
      while (this.audio.currentTime > this.project.time && !this.finished) {
        this.finished = await this.project.next();
      }
    }

    this.project.draw();
    this.controls.onFrame(this.project.frame);
    this.request();
  }

  private request() {
    requestAnimationFrame(async () => {
      try {
        this.controls.loading = true;
        await this.run();
        this.controls.loading = false;
      } catch (e) {
        console.log(e);
      }
    });
  }

  private async getContent(): Promise<Blob> {
    return new Promise<Blob>(resolve =>
      this.project.toCanvas().toBlob(resolve, 'image/png'),
    );
  }
}
