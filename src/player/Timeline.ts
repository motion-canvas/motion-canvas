import {clampRemap} from '../tweening';
import {Player, PlayerState} from './Player';
import {clamp} from 'three/src/math/MathUtils';

export class Timeline {
  private readonly fillTime: HTMLElement;
  private readonly fillSeek: HTMLElement;
  private readonly fillStart: HTMLElement;
  private readonly track: HTMLElement;
  private readonly marker: HTMLElement;
  private readonly timeText: HTMLElement;
  private readonly durationText: HTMLElement;

  private duration: number;
  private labelElements: Record<string, HTMLElement> = {};
  private lastState: PlayerState;

  public constructor(
    private readonly player: Player,
    private readonly root: HTMLElement,
    private readonly labels: Record<string, number>,
  ) {
    this.fillTime = root.querySelector('.fill-time')!;
    this.fillSeek = root.querySelector('.fill-seek')!;
    this.fillStart = root.querySelector('.fill-start')!;
    this.timeText = root.querySelector('.js-current-time')!;
    this.durationText = root.querySelector('.js-duration')!;
    this.track = root.querySelector('.track')!;
    this.marker = root.querySelector('.marker')!;

    this.player.StateChanged.sub(this.update);
    this.root.addEventListener('click', e => {
      const target = <HTMLElement>e.target;
      if (target === this.timeText) {
        this.player.updateState({startFrame: this.lastState.frame});
        return;
      }
      this.player.requestSeek(
        target.classList.contains('label')
          ? parseFloat(target.dataset.time!)
          : this.mousePositionToFrame(e.clientX),
      );
    });
    this.root.addEventListener('contextmenu', e => {
      e.preventDefault();
      this.player.updateState({
        startFrame: this.mousePositionToFrame(e.clientX),
      });
    });
    this.root.addEventListener('mousemove', e => {
      const target = <HTMLElement>e.target;
      const rect = this.track.getBoundingClientRect();
      let x = clamp(e.clientX - rect.left, 8, rect.width);

      if (target.classList.contains('label')) {
        const frame = parseInt(target.dataset.time!);
        x = (frame / this.duration) * rect.width;
      }
      this.fillSeek.style.width = `${x}px`;
    });

    for (const label in labels) {
      const element = document.createElement('div');
      element.classList.add('label');
      element.dataset.title = label;
      element.dataset.time = this.player.project
        .secondsToFrames(labels[label])
        .toString();
      this.track.appendChild(element);
      this.labelElements[label] = element;
    }
  }

  private mousePositionToFrame(position: number) {
    const rect = this.track.getBoundingClientRect();
    const x = position - rect.left;
    return Math.floor(clampRemap(0, rect.width, 0, this.duration, x));
  }

  private update = (state: PlayerState) => {
    this.lastState = {...state};
    this.timeText.innerText = state.frame.toString();
    this.marker.dataset.title = `Frame:${state.startFrame}`;

    const width = this.track.clientWidth;
    const fillWidth = clampRemap(1, state.duration, 8, width, state.frame);
    const startWidth = clampRemap(
      1,
      state.duration,
      8,
      width,
      state.startFrame,
    );

    this.marker.style.left = `${startWidth - 8}px`;
    this.fillStart.style.width = `${startWidth}px`;
    this.fillTime.style.width = `${fillWidth}px`;

    this.durationText.innerText = state.duration.toString();
    this.duration = state.duration;
    for (const label in this.labels) {
      const element = this.labelElements[label];
      const time = parseInt(element.dataset.time);
      const elementLeft = clampRemap(1, state.duration, 8, width, time) - 4;
      element.style.left = `${elementLeft - 20}px`;
      element.classList.toggle('hidden', time > state.duration);
      element.classList.toggle('inverted', time > state.startFrame);
    }
  };
}
