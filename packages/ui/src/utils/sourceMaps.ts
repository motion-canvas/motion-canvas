import {SourceMapConsumer} from 'source-map-js';
import {withLoader} from './withLoader';

const externalFileRegex = /^\/(@fs|@id|node_modules)\//;
const stackTraceRegex = navigator.userAgent.toLowerCase().includes('chrome')
  ? /^ +at.* \(?(.*):([0-9]+):([0-9]+)/
  : /@(.*):([0-9]+):([0-9]+)/;

async function getSourceMap(file: string): Promise<SourceMapConsumer> {
  const response = await fetch(`${file}.map`);
  // TODO Find a way to cache the consumer while staying up-to-date with HMR.
  return new SourceMapConsumer(await response.json());
}

export interface StackTraceEntry {
  file: string;
  uri: string;
  line: number;
  column: number;
  isExternal: boolean;
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
    const match = textLine.match(stackTraceRegex);
    if (!match) continue;
    const [, uri, line, column] = match;
    const file = new URL(uri).pathname;
    const entry: StackTraceEntry = {
      file,
      uri,
      line: parseInt(line),
      column: parseInt(column),
      isExternal: externalFileRegex.test(file),
    };

    if (!externalFileRegex.test(file)) {
      try {
        const sourceMap = await getSourceMap(file);
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
  const relative = entry.source.startsWith('/')
    ? entry.source.slice(1)
    : entry.source;

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

  const sourceLines = source.split('\n');
  const {line, column} = entry;
  const lastLine = line + 2;
  const spacing = lastLine.toString().length;
  const formatted = sourceLines
    .slice(line - 1, lastLine)
    .map((text, index) => `${line + index} | ${text}`);
  formatted.splice(1, 0, `${' '.repeat(spacing)} | ${' '.repeat(column)}^`);
  return formatted.join('\n');
}

export async function findAndOpenFirstUserFile(stack: string) {
  const entry = await resolveStackTrace(stack, true);
  if (entry) {
    await openFileInEditor(entry);
  }
}
