import {Player} from './player/Player';

export function hot(player: Player, root: typeof module) {
  const update = (modules: string[]) => {
    player.project.reload(
      // @ts-ignore
      modules.map(id => __webpack_require__(id).default),
    );
    player.requestSeek(player.project.frame);
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
