import type {Size, Waveform} from './types';
import type {SceneRunner} from './Scene';
import {Project, ProjectSize} from './Project';
import {Player} from './player/Player';
import {hot} from './hot';

interface BootstrapConfig {
  name: string;
  size?: Size;
  scenes: SceneRunner[];
  audio?: {
    meta: Waveform;
    src: string;
  };
}

export function bootstrap(config: BootstrapConfig) {
  const project = new Project({
    name: config.name,
    scenes: config.scenes,
    ...(config.size ?? ProjectSize.FullHD),
  });
  const player = new Player(project, config.audio);
  (<any>window).player = player;

  //@ts-ignore
  const parent = require.cache[module.parents[0]];
  hot(player, parent);
}
