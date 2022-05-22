import {Player} from './player/Player';

export function hot(player: Player, root: NodeModule) {
  const update = async (modules: string[]) => {
    const runners = [];
    for (const module of modules) {
      const runner = __webpack_require__(module).default;
      if (
        // FIXME Find out a better way to detect runner factories.
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
    let meta = null;
    for (const module of modules) {
      const audio = __webpack_require__(module);
      if (typeof audio === 'object') {
        meta = audio.default;
      } else {
        src = audio;
      }
    }

    if (src && meta) {
      player.reloadAudio(src, meta);
    }
  };

  const scenePaths = __webpack_require__.c[root.id].children.filter(
    (name: string) => name.match(/\.scene\.[jt]sx?/),
  );

  const audioPaths = __webpack_require__.c[root.id].children.filter(
    (name: string) => name.match(/\.wav/),
  );

  root.hot.accept(scenePaths, update);
  module.hot.accept(scenePaths, update);
  root.hot.accept(audioPaths, updateAudio);
  module.hot.accept(audioPaths, updateAudio);
}
