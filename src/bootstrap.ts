import type {Size} from './types';
import type {SceneRunner} from './Scene';
import {Project, ProjectSize} from './Project';
import {Player} from './player/Player';
import {hot} from './hot';
import {AudioManager} from './audio/AudioManager';

interface BootstrapConfig {
  name: string;
  scenes: SceneRunner[];
  size?: Size;
  background?: string | false;
  audio?: string;
  audioOffset?: number;
}

export function bootstrap(config: BootstrapConfig) {
  const project = new Project({
    name: config.name,
    scenes: config.scenes,
    background: config.background ?? '#141414',
    ...(config.size ?? ProjectSize.FullHD),
  });
  const audio = new AudioManager();
  if (config.audio) {
    audio.setSource(config.audio);
  }
  if (config.audioOffset) {
    audio.setOffset(config.audioOffset);
  }
  const player = new Player(project, audio);
  (<any>window).player = player;

  //@ts-ignore
  const parent = require.cache[module.parents[0]];
  hot(player, parent);
}
