import fs from 'fs';

export async function createDir(path: string): Promise<void> {
  try {
    await fs.promises.mkdir(path);
  } catch (e) {
    throw new Error(`mkdir failed\n${e}`);
  }
}
