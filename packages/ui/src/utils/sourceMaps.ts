import highlight from 'highlight.js';
import {SourceMapConsumer} from 'source-map-js';
import {withLoader} from './withLoader';

declare module 'source-map-js' {
  interface SourceMapConsumer {
    raw: any;
  }
}

const ExternalFileRegex = /^\/(@fs|@id|node_modules)\//;
const StackTraceRegex = navigator.userAgent.toLowerCase().includes('chrome')
  ? /^ +at(.*) \(?(.*):([0-9]+):([0-9]+)/
  : /([^@]*)@(.*):([0-9]+):([0-9]+)/;
const Cache = new Map<string, SourceMapConsumer>();

async function getSourceMap(
  file: string,
  search = '',
): Promise<SourceMapConsumer> {
  const key = `${file}.map${search}`;
  if (Cache.has(key)) {
    return Cache.get(key);
  }

  const response = await fetch(`${file}.map${search}`);
  const json = await response.json();
  const consumer = new SourceMapConsumer(json);
  consumer.raw = json;
  Cache.set(key, consumer);
  return consumer;
}

export interface StackTraceEntry {
  file: string;
  uri: string;
  line: number;
  column: number;
  isExternal: boolean;
  functionName?: string;
  source?: string;
  sourceMap?: SourceMapConsumer;
}

export async function resolveStackTrace(
  stack: string,
  firstOnly: true,
): Promise<StackTraceEntry>;
export async function resolveStackTrace(
  stack: string,
): Promise<StackTraceEntry[]>;
export async function resolveStackTrace(
  stack: string,
  firstOnly?: boolean,
): Promise<StackTraceEntry[] | StackTraceEntry> {
  const result: StackTraceEntry[] = [];
  for (const textLine of stack.split('\n')) {
    const match = textLine.match(StackTraceRegex);
    if (!match) continue;
    const [, functionName, uri, line, column] = match;
    const parsed = new URL(uri);
    const file = parsed.pathname;
    const directory = file.split('/').slice(0, -1).join('/') + '/';
    const entry: StackTraceEntry = {
      file,
      uri,
      line: parseInt(line),
      column: parseInt(column),
      isExternal: ExternalFileRegex.test(file),
      functionName: functionName?.trim(),
    };

    if (!entry.isExternal) {
      try {
        const sourceMap = await getSourceMap(file, parsed.search);
        const position = sourceMap.originalPositionFor(entry);
        if (position.line === null || position.column === null) {
          entry.isExternal = true;
        } else {
          const source =
            position.source[0] === '/'
              ? position.source
              : directory + position.source;

          entry.file = source;
          entry.line = position.line;
          entry.column = position.column;
          entry.source = position.source;
          entry.sourceMap = sourceMap;

          if (firstOnly) {
            return entry;
          }
        }
      } catch (e) {
        entry.isExternal = true;
      }
    }

    result.push(entry);

    if (entry.sourceMap?.raw?.includeMap) {
      const includeMap: Record<string, [string, number]> =
        entry.sourceMap.raw.includeMap;
      let current = entry;
      while (current.source in includeMap) {
        const [path, line] = includeMap[current.source];
        const file = directory + path;
        current = {
          file,
          uri: file,
          line,
          column: 9,
          isExternal: false,
          source: path,
          sourceMap: entry.sourceMap,
        };
        result.push(current);
      }
    }
  }

  if (firstOnly) {
    return null;
  }

  return result;
}

export async function openFileInEditor(entry: StackTraceEntry) {
  const relative = entry.file.startsWith('/')
    ? entry.file.slice(1)
    : entry.file;

  await withLoader(() =>
    fetch(
      `/__open-in-editor?file=${encodeURIComponent(relative)}:${entry.line}:${
        entry.column
      }`,
    ),
  );
}

export function getSourceCodeFrame(entry: StackTraceEntry): string | null {
  if (!entry.source || !entry.sourceMap) {
    return null;
  }
  const source = entry.sourceMap.sourceContentFor(entry.source, true);
  if (!source) {
    return null;
  }

  const {line, column} = entry;
  const lastLine = line + 2;
  const spacing = lastLine.toString().length;
  const language = getExtension(entry.source) ?? 'ts';

  const code = highlight
    .highlight(source, {language})
    .value.split('\n')
    .slice(line - 1, lastLine);

  const formatted = code.map(
    (text, index) =>
      `${(line + index).toString().padStart(spacing, ' ')} | ${text}`,
  );
  formatted.splice(1, 0, `${' '.repeat(spacing)} | ${' '.repeat(column)}^`);
  return formatted.join('\n');
}

export async function findAndOpenFirstUserFile(stack: string) {
  const entry = await resolveStackTrace(stack, true);
  if (entry) {
    await openFileInEditor(entry);
  }
}

function getExtension(file: string): string | null {
  const parts = file.split('.');
  return parts.length > 1 ? parts.pop() : null;
}
