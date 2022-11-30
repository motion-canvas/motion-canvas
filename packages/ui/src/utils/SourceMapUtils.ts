import {MappedPosition, SourceMapConsumer} from 'source-map-js';

export interface FileInfo {
  position: MappedPosition;
  sourceMap: SourceMapConsumer;
}

const sourceMaps: Record<string, SourceMapConsumer> = {};
const externalFileRegex = /^\/(@fs|node_modules)\//;
const stackTraceRegex = navigator.userAgent.toLowerCase().includes('chrome')
  ? /^ +at.+\((.*):([0-9]+):([0-9]+)/
  : /@(.*):([0-9]+):([0-9]+)/;

async function getSourceMap(file: string): Promise<SourceMapConsumer> {
  if (file in sourceMaps) {
    return sourceMaps[file];
  }

  const response = await fetch(`${file}.map`);
  const sourceMap = new SourceMapConsumer(await response.json());
  sourceMaps[file] = sourceMap;

  return sourceMap;
}

export async function findFirstUserFile(
  stack: string,
): Promise<FileInfo | null> {
  const lines = stack.split('\n');
  while (lines.length > 0) {
    const match = lines.pop().match(stackTraceRegex);
    if (!match) continue;
    const [, uri, line, column] = match;
    const file = new URL(uri).pathname;
    if (!externalFileRegex.test(file)) {
      try {
        const sourceMap = await getSourceMap(file);
        const position = sourceMap.originalPositionFor({
          line: parseInt(line),
          column: parseInt(column),
        });
        return {sourceMap, position};
      } catch (e) {
        // do nothing
      }
    }
  }

  return null;
}

export async function openFileInEditor(position: MappedPosition) {
  const relative = position.source.startsWith('/')
    ? position.source.slice(1)
    : position.source;
  await fetch(
    `/__open-in-editor?file=${encodeURIComponent(relative)}:${position.line}:${
      position.column
    }`,
  );
}

export function getSourceCodeFrame(info: FileInfo): string {
  const source = info.sourceMap.sourceContentFor(info.position.source);
  const sourceLines = source.split('\n');
  const {line, column} = info.position;
  const formated = sourceLines
    .slice(line - 1, line + 2)
    .map((text, index) => `${line + index} | ${text}`);
  formated.splice(1, 0, `   | ${' '.repeat(column)}^`);
  return formated.join('\n');
}

export async function findAndOpenFirstUserFile(stack: string) {
  const fileInfo = await findFirstUserFile(stack);
  if (fileInfo) {
    await openFileInEditor(fileInfo.position);
  }
}
