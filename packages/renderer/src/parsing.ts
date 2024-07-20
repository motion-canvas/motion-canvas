import {InvalidOptionArgumentError} from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

export function parseTuple(value: string) {
  const [from, to] = value.split(':');
  if (to === undefined) {
    throw new InvalidOptionArgumentError(`Missing colon.`);
  }

  const parsedFrom = parseFloat(from);
  if (isNaN(parsedFrom)) {
    throw new InvalidOptionArgumentError(`"${from}" is not a number.`);
  }

  const parsedTo = parseFloat(to);
  if (isNaN(parsedTo)) {
    throw new InvalidOptionArgumentError(`"${to}" is not a number.`);
  }

  return [parsedFrom, parsedTo];
}

export function parseRecord(
  value: string,
  previous: Record<string, string> = {},
) {
  const [key, val] = value.split('=');
  if (val === undefined) {
    throw new InvalidOptionArgumentError(`Missing equals sign.`);
  }

  return {
    ...previous,
    [key]: val,
  };
}

export function parseJSONString(
  value: string,
  previous: Record<string, string> = {},
) {
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    throw new InvalidOptionArgumentError(error as string);
  }

  if (!parsed && typeof parsed !== 'object') {
    throw new InvalidOptionArgumentError('Not a valid JSON object.');
  }

  return {
    ...previous,
    ...parsed,
  };
}

export function parseJSONFile(
  file: string,
  previous: Record<string, string> = {},
) {
  const filePath = path.resolve(process.cwd(), file);
  let value: string;
  try {
    value = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new InvalidOptionArgumentError(error as string);
  }

  return parseJSONString(value, previous);
}
