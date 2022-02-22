import {Project} from './Project';

const MINIMUM_ANIMATION_DURATION = 1000;
const MAX_AUDIO_DESYNC = 1 / 50;

class Controls {
  private play: HTMLInputElement;
  private loop: HTMLInputElement;
  private from: HTMLInputElement;
  private current: HTMLInputElement;
  private speed: HTMLInputElement;
  private stepRequested: boolean = false;
  private resetRequested: boolean = false;

  public get isPlaying(): boolean {
    if (this.stepRequested) {
      this.stepRequested = false;
      return true;
    }

    return this.play.checked;
  }

  public get isLooping(): boolean {
    return this.loop.checked;
  }

  public get startFrom(): number {
    return parseInt(this.from.value);
  }

  public get shouldReset(): boolean {
    if (this.resetRequested) {
      this.resetRequested = false;
      return true;
    }

    return false;
  }

  public get playbackSpeed(): number {
    return parseFloat(this.speed.value);
  }

  public constructor(private form: HTMLFormElement) {
    this.play = form.play;
    this.loop = form.loop;
    this.from = form.from;
    this.current = form.current;
    this.speed = form.speed;

    form.next.addEventListener('click', () => {
      this.stepRequested = true;
    });
    form.refresh.addEventListener('click', () => {
      this.resetRequested = true;
    });
  }

  public onFrame(frame: number) {
    this.current.value = Math.floor(frame).toString();
  }
}

export function Player(factory: () => Project, audioSrc?: string) {
  const controls = new Controls(
    <HTMLFormElement>document.getElementById('controls'),
  );
  const project = factory();
  let startTime = performance.now();
  let finished = false;
  let audio: HTMLAudioElement;
  if (audioSrc) {
    audio = new Audio(audioSrc);
    audio.play();
  }

  const reset = () => {
    startTime = performance.now();
    project.start();
    project.next();
    project.draw();
    controls.onFrame(project.frame);
    finished = false;
    if (audio) {
      audio.currentTime = 0;
    }
  };

  const run = () => {
    if (controls.shouldReset) {
      reset();
    }

    if (!controls.isPlaying || audio?.currentTime < project.time) {
      requestAnimationFrame(run);
      return;
    }

    try {
      if (finished) {
        if (controls.isLooping) {
          // Prevent animation from restarting too quickly.
          const animationDuration = performance.now() - startTime;
          if (animationDuration < MINIMUM_ANIMATION_DURATION) {
            setTimeout(run, MINIMUM_ANIMATION_DURATION - animationDuration);
            return;
          }
          reset();
        } else {
          requestAnimationFrame(run);
          return;
        }
      }

      finished = project.next(controls.playbackSpeed);

      // Start from certain frame
      while (project.frame < controls.startFrom && !finished) {
        finished = project.next();
      }

      // Synchronize animation with audio.
      if (audio?.currentTime - MAX_AUDIO_DESYNC > project.time) {
        while (audio.currentTime > project.time && !finished) {
          finished = project.next();
        }
      }

      project.draw();
      controls.onFrame(project.frame);
      requestAnimationFrame(run);
    } catch (e) {
      console.error(e);
    }
  };
  reset();
  run();
}
