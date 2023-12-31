import highlight from 'highlight.js';
import {SourceMapConsumer} from 'source-map-js';
import {withLoader} from './withLoader';

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
  const consumer = new SourceMapConsumer(await response.json());
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
    const entry: StackTraceEntry = {
      file,
      uri,
      line: parseInt(line),
      column: parseInt(column),
      isExternal: ExternalFileRegex.test(file),
      functionName: functionName?.trim(),
    };

    if (!ExternalFileRegex.test(file)) {
      try {
        const sourceMap = await getSourceMap(file, parsed.search);
        const position = sourceMap.originalPositionFor(entry);
        if (position.line === null || position.column === null) {
          entry.isExternal = true;
        } else {
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
  const sourceLines = source.split('\n').slice(line - 1, lastLine);

  const code = highlight
    .highlight('typescript', sourceLines.join('\n'))
    .value.split('\n');

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
