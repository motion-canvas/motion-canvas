import type {Player} from './player';

export function hot(player: Player, root: NodeModule) {
  const updateScenes = async (modules: string[]) => {
    const runners = [];
    for (const module of modules) {
      const runner = __webpack_require__(module).default;
      if (
        // FIXME Find a better way to detect runner factories.
        runner.name === '__WEBPACK_DEFAULT_EXPORT__' &&
        typeof runner === 'function'
      ) {
        runners.push(await runner());
      } else {
        runners.push(runner);
      }
    }

    player.project.reload(runners);
    player.reload();
  };

  const updateAudio = async (modules: string[]) => {
    let src = null;
    for (const module of modules) {
      const audio = __webpack_require__(module);
      if (typeof audio === 'string') {
        src = audio;
        break;
      }
    }

    if (src) {
      player.audio.setSource(src);
    }
  };

  const scenePaths = __webpack_require__.c[root.id].children.filter(
    (name: string) => name.match(/\.scene\.[jt]sx?/),
  );

  const audioPaths = __webpack_require__.c[root.id].children.filter(
    (name: string) => name.match(/\.wav/),
  );

  root.hot.accept(scenePaths, updateScenes);
  module.hot.accept(scenePaths, updateScenes);
  root.hot.accept(audioPaths, updateAudio);
  module.hot.accept(audioPaths, updateAudio);
}
