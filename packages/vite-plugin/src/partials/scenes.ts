import path from 'path';
import {Plugin} from 'vite';
import {createMeta} from '../utils';

const SCENE_QUERY_REGEX = /[?&]scene\b/;

export function scenesPlugin(): Plugin {
  return {
    name: 'motion-canvas:scene',

    async load(id) {
      if (!SCENE_QUERY_REGEX.test(id)) {
        return;
      }

      const [base] = id.split('?');
      const {name, dir} = path.posix.parse(base);
      const metaFile = `${name}.meta`;
      await createMeta(path.join(dir, metaFile));
      const sceneFile = `${name}`;

      /* language=typescript */
      return `\
import {ValueDispatcher} from '@motion-canvas/core';
import metaFile from './${metaFile}';
import description from './${sceneFile}';
description.name = '${name}';
metaFile.attach(description.meta);
if (import.meta.hot) {
  description.onReplaced = import.meta.hot.data.onReplaced;
}
description.onReplaced ??= new ValueDispatcher(description.config);
if (import.meta.hot) {
  import.meta.hot.accept();
  if (import.meta.hot.data.onReplaced) {
    description.onReplaced.current = description;
  } else {
    import.meta.hot.data.onReplaced = description.onReplaced;
  }
}
export default description;
`;
    },
  };
}
