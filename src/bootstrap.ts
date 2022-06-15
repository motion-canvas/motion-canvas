import './globals';
import type {Size} from './types';
import type {SceneRunner} from './Scene';
import {Project, ProjectSize} from './Project';
import {Player} from './player';
import {hot} from './hot';
import {AudioManager} from './audio';

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
  window.player = player;

  let root: NodeModule = null;
  const queue = [...module.parents];
  while (queue.length > 0) {
    const path = queue.shift();
    const current = __webpack_require__.c[path];
    if (!path.endsWith('lib/index.js')) {
      root = current;
      break;
    }
    queue.push(...current.parents);
  }

  if (root) {
    hot(player, root);
  } else {
    console.warn('Root module not found. Hot reload will not work.');
  }
}
