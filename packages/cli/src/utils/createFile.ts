import fs from 'fs';

export async function createFile(
  path: string,
  contents: string,
): Promise<void> {
  fs.writeFile(path, contents, e => {
    if (e) throw e;
  });
}
