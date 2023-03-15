import fs from 'fs';
import kleur from 'kleur';

export async function createDir(path) {
  await fs.mkdir(path, e => {
    if (e) {
      console.error(kleur.red(`Could not create file ${path}\n${e}`));
    }
  });
}
