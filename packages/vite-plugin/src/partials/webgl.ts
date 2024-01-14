import fs from 'fs';
import path from 'path';
import {SourceNode} from 'source-map';
import {normalizePath, Plugin, ResolvedConfig} from 'vite';

declare module 'source-map' {
  interface SourceNode {
    add(value: string | SourceNode): void;
  }

  interface SourceMapGenerator {
    toJSON(): any;
  }
}

const GLSL_EXTENSION_REGEX = /\.glsl(?:$|\?)/;
const INCLUDE_REGEX = /^#include "([^"]+)"/;

export function webglPlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'motion-canvas:webgl',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async transform(code, id) {
      if (!GLSL_EXTENSION_REGEX.test(id)) {
        return;
      }

      const [base, query] = id.split('?');
      const {dir} = path.posix.parse(base);
      const params = new URLSearchParams(query);
      if (params.has('raw')) {
        return;
      }

      const context: ResolutionContext = {
        rootDir: dir,
        fileStack: [],
        includeMap: new Map(),
        watchFile: file => this.addWatchFile(file),
        resolve: async (source, importer) => {
          const resolved = await this.resolve(source, importer);
          return resolved?.id;
        },
      };

      const glslSource = await resolveGlsl(context, id, code);
      const sourceUrl = normalizePath(path.relative(config.root, base));

      const result = glslSource.toStringWithSourceMap();
      const map = result.map.toJSON();
      map.includeMap = Object.fromEntries(context.includeMap);

      return {
        map,
        code: `export default \`${result.code}\n//# sourceURL=${sourceUrl}\`;`,
      };
    },
  };
}

interface ResolutionContext {
  watchFile: (file: string) => void;
  resolve: (source: string, importer: string) => Promise<string | undefined>;
  rootDir: string;
  includeMap: Map<string, [string, number]>;
  fileStack: string[];
}

async function resolveGlsl(
  context: ResolutionContext,
  id: string,
  code: string,
): Promise<SourceNode> {
  const lines = code.split(/\r?\n/);
  const source = new SourceNode(1, 0, '', '');

  if (context.fileStack.includes(id)) {
    throw new Error(
      `Circular dependency detected: ${context.fileStack.join(' -> ')}`,
    );
  }

  context.fileStack.push(id);

  const sourceMapId = path.posix.relative(context.rootDir, id);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(INCLUDE_REGEX);
    if (match) {
      const childId = await context.resolve(match[1], id);
      if (!childId) {
        continue;
      }

      const childSourceMapId = path.posix.relative(context.rootDir, childId);
      if (context.includeMap.has(childSourceMapId)) {
        continue;
      }

      context.includeMap.set(childSourceMapId, [sourceMapId, i + 1]);
      context.watchFile(childId);
      const childCode = await fs.promises.readFile(childId, 'utf-8');
      source.add(await resolveGlsl(context, childId, childCode));
    } else {
      let j = 0;
      for (; j < line.length; j++) {
        source.add(new SourceNode(i + 1, j, sourceMapId, line[j]));
      }
      source.add(new SourceNode(i + 1, j, sourceMapId, '\n'));
    }
  }
  context.fileStack.pop();

  return source;
}
