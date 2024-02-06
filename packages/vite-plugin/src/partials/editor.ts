import fs from 'fs';
import path from 'path';
import {Plugin} from 'vite';
import {Projects} from '../utils';

interface EditorPluginConfig {
  editor: string;
  projects: Projects;
}

export function editorPlugin({editor, projects}: EditorPluginConfig): Plugin {
  const editorPath = path.dirname(require.resolve(editor));
  const editorFile = fs.readFileSync(path.resolve(editorPath, 'editor.html'));
  const htmlParts = editorFile
    .toString()
    .replace('{{style}}', `/@fs/${path.resolve(editorPath, 'style.css')}`)
    .split('{{source}}');
  const createHtml = (src: string) => htmlParts[0] + src + htmlParts[1];

  const resolvedEditorId = '\0virtual:editor';

  return {
    name: 'motion-canvas:editor',

    async load(id) {
      const [, query] = id.split('?');

      if (id.startsWith(resolvedEditorId)) {
        if (projects.list.length === 1) {
          /* language=typescript */
          return `\
import {editor} from '${editor}';
import project from '${projects.list[0].url}?project';
editor(project);
`;
        }

        if (query) {
          const params = new URLSearchParams(query);
          const name = params.get('project');
          if (name && projects.lookup.has(name)) {
            /* language=typescript */
            return `\
import {editor} from '${editor}';
import project from '${projects.lookup.get(name)!.url}?project';
editor(project);
`;
          }
        }

        /* language=typescript */
        return `\
import {index} from '${editor}';
index(${JSON.stringify(projects.list)});
`;
      }
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          const url = new URL(req.url, `http://${req.headers.host}`);
          if (url.pathname === '/') {
            res.setHeader('Content-Type', 'text/html');
            res.end(createHtml('/@id/__x00__virtual:editor'));
            return;
          }

          const name = url.pathname.slice(1);
          if (name && projects.lookup.has(name)) {
            res.setHeader('Content-Type', 'text/html');
            res.end(createHtml(`/@id/__x00__virtual:editor?project=${name}`));
            return;
          }
        }

        next();
      });
    },
  };
}
