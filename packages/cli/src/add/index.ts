import prompts from 'prompts';
import kleur from 'kleur';

import {addProject} from './commands/project';
import {addScene} from './commands/scene';

export async function add() {
  const response = await prompts({
    type: 'select',
    name: 'type',
    message: 'New',
    choices: [
      {
        title: 'scene',
        value: 'scene',
      },
      {
        title: 'project',
        value: 'project',
      },
    ],
  });

  switch (response.type) {
    case 'scene': {
      try {
        await addScene();
      } catch (e) {
        console.error(kleur.red(`addScene failed with error:\n${e}`));
      }
      break;
    }
    case 'project': {
      try {
        await addProject();
      } catch (e) {
        console.error(kleur.red(`addProject failed with error:\n${e}`));
      }
      break;
    }
  }
}
