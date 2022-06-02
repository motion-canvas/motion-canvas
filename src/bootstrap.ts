import type {Size, Waveform} from './types';
import type {SceneRunner} from './Scene';
import {Project, ProjectSize} from './Project';
import {Player} from './player/Player';
import {hot} from './hot';

interface BootstrapConfig {
  name: string;
  size?: Size;
  background?: string | false;
  scenes: SceneRunner[];
  audio?: {
    meta: Waveform;
    src: string;
    offset?: number;
  };
}

export function bootstrap(config: BootstrapConfig) {
  const project = new Project({
    name: config.name,
    scenes: config.scenes,
    background: config.background ?? '#141414',
    ...(config.size ?? ProjectSize.FullHD),
  });
  const player = new Player(
    project,
    config.audio && {
      offset: 0,
      ...config.audio,
    },
  );
  (<any>window).player = player;

  //@ts-ignore
  const parent = require.cache[module.parents[0]];
  hot(player, parent);
}
