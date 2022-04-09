import {Player} from './player/Player';

export function hot(player: Player, root: typeof module) {
  const update = async (modules: string[]) => {
    const runners = [];
    for (const module of modules) {
      // @ts-ignore
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

  const scenePaths = require.cache[root.id].children.filter(name =>
    //@ts-ignore
    name.match(/\.scene\.[jt]sx?/),
  );

  //@ts-ignore
  root.hot.accept(scenePaths, update);
  //@ts-ignore
  module.hot.accept(scenePaths, update);
}
