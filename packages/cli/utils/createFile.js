import fs from 'fs';
import kleur from 'kleur';

export async function createFile(path, contents) {
  await fs.writeFile(path, contents, e => {
    if (e) {
      console.error(kleur.red(`Could not create file ${path}\n${e}`));
    }
  });
}
