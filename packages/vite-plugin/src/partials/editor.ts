import fs from 'fs';
import path from 'path';
import {PLUGIN_OPTIONS, Plugin, ProjectData} from '../plugins';

export function editorPlugin(): Plugin {
  const resolvedEditorId = '\0virtual:editor';

  let editor: string;
  let createHtml: (src: string) => string;
  let projects: ProjectData[];
  const lookup = new Map<string, ProjectData>();

  return {
    name: 'motion-canvas:editor',

    [PLUGIN_OPTIONS]: {
      async configResolved(value) {
        editor = value.editor;
        const editorPath = path.dirname(require.resolve(editor));
        const editorFile = fs.readFileSync(
          path.resolve(editorPath, 'editor.html'),
        );
        const htmlParts = editorFile
          .toString()
          .replace('{{style}}', `/@fs/${path.resolve(editorPath, 'style.css')}`)
          .split('{{source}}');
        createHtml = (src: string) => htmlParts[0] + src + htmlParts[1];

        projects = value.projects;
        for (const project of projects) {
          lookup.set(project.name, project);
        }
      },
    },

    async load(id) {
      const [, query] = id.split('?');

      if (id.startsWith(resolvedEditorId)) {
        const params = new URLSearchParams(query);
        const name = params.get('project');
        if (name && lookup.has(name)) {
          if (params.has('headless')) {
            return `\
import {headless} from '${editor}';
import project from '${lookup.get(name)!.url}?project';
headless(project, ${params.get('headless')});
`;
          } else {
            /* language=typescript */
            return `\
import {editor} from '${editor}';
import project from '${lookup.get(name)!.url}?project';
editor(project);
`;
          }
        }

        /* language=typescript */
        return `\
import {index} from '${editor}';
index(${JSON.stringify(projects)});
`;
      }
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const name =
            url.pathname === '/' ? projects[0].name : url.pathname.slice(1);
          if (name && lookup.has(name)) {
            const params = new URLSearchParams(url.search);
            const editorParams = new URLSearchParams();

            if (params.has('headless')) {
              editorParams.set('headless', params.get('headless')!);
            }
            editorParams.set('project', name);
            res.setHeader('Content-Type', 'text/html');
            res.end(createHtml(`/@id/__x00__virtual:editor?${editorParams}`));
            return;
          }
        }

        next();
      });
    },
  };
}
