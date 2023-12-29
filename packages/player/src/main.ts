import type {PlayerSettings, Project, StageSettings} from '@motion-canvas/core';
import {Player, Stage} from '@motion-canvas/core';

import {Vector2} from '@motion-canvas/core';
import styles from './styles.scss?inline';
import html from './template.html?raw';

const TEMPLATE = `<style>${styles}</style>${html}`;
const ID = 'motion-canvas-player';

enum State {
  Initial = 'initial',
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error',
}

class MotionCanvasPlayer extends HTMLElement {
  public static get observedAttributes() {
    return ['src', 'quality', 'width', 'height', 'auto', 'variables'];
  }

  private get auto() {
    const attr = this.getAttribute('auto');
    return !!attr;
  }

  private get hover() {
    return this.getAttribute('auto') === 'hover';
  }

  private get quality() {
    const attr = this.getAttribute('quality');
    return attr ? parseFloat(attr) : this.defaultSettings.resolutionScale;
  }

  private get width() {
    const attr = this.getAttribute('width');
    return attr ? parseFloat(attr) : this.defaultSettings.size.width;
  }

  private get height() {
    const attr = this.getAttribute('height');
    return attr ? parseFloat(attr) : this.defaultSettings.size.height;
  }

  private get variables() {
    try {
      const attr = this.getAttribute('variables');
      return attr ? JSON.parse(attr) : {};
    } catch {
      this.project.logger.warn(`Project variables could not be parsed.`);
      return {};
    }
  }

  private readonly root: ShadowRoot;
  private readonly canvas: HTMLCanvasElement;
  private readonly overlay: HTMLCanvasElement;
  private readonly button: HTMLDivElement;

  private state = State.Initial;
  private project: Project | null = null;
  private player: Player | null = null;
  private defaultSettings: PlayerSettings & StageSettings;
  private abortController: AbortController | null = null;
  private mouseMoveId: number | null = null;
  private finished = false;
  private playing = false;
  private connected = false;
  private stage = new Stage();

  public constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    this.root.innerHTML = TEMPLATE;

    this.overlay = this.root.querySelector('.overlay');
    this.button = this.root.querySelector('.button');
    this.canvas = this.stage.finalBuffer;
    this.canvas.classList.add('canvas');
    this.root.prepend(this.canvas);

    this.overlay.addEventListener('click', this.handleClick);
    this.overlay.addEventListener('mousemove', this.handleMouseMove);
    this.overlay.addEventListener('mouseleave', this.handleMouseLeave);
    this.button.addEventListener('mousedown', this.handleMouseDown);

    this.setState(State.Initial);
  }

  private handleMouseMove = () => {
    if (this.mouseMoveId) {
      clearTimeout(this.mouseMoveId);
    }
    if (this.hover && !this.playing) {
      this.setPlaying(true);
    }

    this.mouseMoveId = window.setTimeout(() => {
      this.mouseMoveId = null;
      this.updateClass();
    }, 2000);
    this.updateClass();
  };

  private handleMouseLeave = () => {
    if (this.hover) {
      this.setPlaying(false);
    }
    if (this.mouseMoveId) {
      clearTimeout(this.mouseMoveId);
      this.mouseMoveId = null;
      this.updateClass();
    }
  };

  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
  };

  private handleClick = () => {
    if (this.auto) return;
    this.handleMouseMove();
    this.setPlaying(!this.playing);
    this.button.animate(
      [
        {scale: `0.9`},
        {
          scale: `1`,
          easing: 'ease-out',
        },
      ],
      {duration: 200},
    );
  };

  private setState(state: State) {
    this.state = state;
    this.setPlaying(this.playing);
  }

  private setPlaying(value: boolean) {
    if (this.state === State.Ready && (value || (this.auto && !this.hover))) {
      this.player?.togglePlayback(true);
      this.playing = true;
    } else {
      this.player?.togglePlayback(false);
      this.playing = false;
    }
    this.updateClass();
  }

  private updateClass() {
    this.overlay.className = `overlay state-${this.state}`;
    this.canvas.className = `canvas state-${this.state}`;
    this.overlay.classList.toggle('playing', this.playing);
    this.overlay.classList.toggle('auto', this.auto);
    this.overlay.classList.toggle('hover', this.mouseMoveId !== null);

    if (this.connected) {
      if (this.mouseMoveId !== null || !this.playing) {
        this.dataset.overlay = '';
      } else {
        delete this.dataset.overlay;
      }
    }
  }

  private async updateSource(source: string) {
    this.setState(State.Initial);

    this.abortController?.abort();
    this.abortController = new AbortController();

    let project: Project;
    try {
      const promise = import(
        /* webpackIgnore: true */ /* @vite-ignore */ source
      );
      const delay = new Promise(resolve => setTimeout(resolve, 200));
      await Promise.any([delay, promise]);
      this.setState(State.Loading);
      project = (await promise).default;
    } catch (e) {
      console.error(e);
      this.setState(State.Error);
      return;
    }

    this.defaultSettings = project.meta.getFullRenderingSettings();
    const player = new Player(project);
    player.setVariables(this.variables);

    this.finished = false;
    this.player?.onRender.unsubscribe(this.render);
    this.player?.togglePlayback(false);
    this.player?.deactivate();
    this.project = project;
    this.player = player;
    this.updateSettings();
    this.player.onRender.subscribe(this.render);
    this.player.togglePlayback(this.playing);
    if (import.meta.env.DEV) {
      this.player.logger.onLogged.subscribe(console.log);
    }

    this.setState(State.Ready);
  }

  private attributeChangedCallback(name: string, _: any, newValue: any) {
    switch (name) {
      case 'auto':
        this.setPlaying(this.playing);
        break;
      case 'src':
        this.updateSource(newValue);
        break;
      case 'quality':
      case 'width':
      case 'height':
        this.updateSettings();
        break;
      case 'variables':
        this.player?.setVariables(this.variables);
    }
  }

  private disconnectedCallback() {
    this.connected = false;
    this.player?.deactivate();
    this.player?.onRender.unsubscribe(this.render);
  }

  private connectedCallback() {
    this.connected = true;
    this.player?.activate();
    this.player?.onRender.subscribe(this.render);
  }

  private render = async () => {
    if (this.player) {
      await this.stage.render(
        this.player.playback.currentScene,
        this.player.playback.previousScene,
      );
    }
  };

  private updateSettings() {
    const settings = {
      ...this.defaultSettings,
      size: new Vector2(this.width, this.height),
      resolutionScale: this.quality,
    };
    this.stage.configure(settings);
    this.player.configure(settings);
  }
}

if (!customElements.get(ID)) {
  customElements.define(ID, MotionCanvasPlayer);
}
