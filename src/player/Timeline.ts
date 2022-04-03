import {clampRemap} from '../tweening';
import {Player, PlayerState} from './Player';

export class Timeline {
  private readonly fillTime: HTMLElement;
  private readonly fillSeek: HTMLElement;
  private readonly fillStart: HTMLElement;
  private readonly track: HTMLElement;
  private readonly marker: HTMLElement;

  private duration: number;
  private labelElements: Record<string, HTMLElement> = {};

  public constructor(
    private readonly player: Player,
    private readonly root: HTMLElement,
    private readonly labels: Record<string, number>,
  ) {
    this.fillTime = root.querySelector('.fill-time')!;
    this.fillSeek = root.querySelector('.fill-seek')!;
    this.fillStart = root.querySelector('.fill-start')!;
    this.track = root.querySelector('.track')!;
    this.marker = root.querySelector('.marker')!;

    this.fillSeek.style.opacity = '0';

    this.player.StateChanged.sub(this.update);
    this.root.addEventListener('click', e => {
      const target = <HTMLElement>e.target;
      this.player.requestSeek(
        target.classList.contains('label')
          ? this.player.project.secondsToFrames(
              parseFloat(target.dataset.time!),
            )
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
      const rect = this.track.getBoundingClientRect();
      const x = e.clientX - rect.left;
      this.fillSeek.style.width = `${x}px`;
    });
    this.root.addEventListener('mouseleave', () => {
      this.fillSeek.style.opacity = '0';
    });
    this.root.addEventListener('mouseenter', () => {
      this.fillSeek.style.opacity = '0.32';
    });

    for (const label in labels) {
      const element = document.createElement('div');
      element.classList.add('label');
      element.dataset.title = label;
      element.dataset.time = labels[label].toString();
      root.appendChild(element);
      this.labelElements[label] = element;
    }
  }

  private mousePositionToFrame(position: number) {
    const rect = this.track.getBoundingClientRect();
    const x = position - rect.left;
    return Math.floor(clampRemap(0, rect.width, 0, this.duration, x));
  }

  private update = (state: PlayerState) => {
    this.duration = state.duration;
    const width = this.track.clientWidth;
    const fillWidth = clampRemap(1, state.duration, 8, width, state.frame);
    const startWidth = clampRemap(
      1,
      state.duration,
      8,
      width,
      state.startFrame,
    );
    const left =
      clampRemap(1, state.duration, 0, width - 8, state.startFrame) + 16;

    this.marker.style.left = `${left}px`;
    this.fillTime.style.width = `${fillWidth}px`;
    this.fillStart.style.width = `${startWidth}px`;

    for (const label in this.labels) {
      const element = this.labelElements[label];
      const elementFrame = this.player.project.secondsToFrames(
        this.labels[label],
      );
      const elementLeft = clampRemap(
        1,
        state.duration,
        0,
        width - 8,
        elementFrame,
      );
      element.style.left = `${elementLeft}px`;
    }
  };
}
