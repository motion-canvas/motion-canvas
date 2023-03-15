import prompts from 'prompts';

import {addProject} from './commands/project.js';

export async function Add() {
  const response = await prompts({
    type: 'select',
    name: 'type',
    message: 'Type',
    choices: [
      {
        title: 'scene',
        value: 'scene',
      },
      {
        title: 'project',
        value: 'project',
      },
      {
        title: 'component',
        value: 'component',
      },
    ],
  });

  switch (response.type) {
    case 'scene': {
      break;
    }
    case 'project': {
      addProject();
      break;
    }
    case 'component': {
      break;
    }
  }
}
