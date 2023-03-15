#!/usr/bin/env node

import prompts from 'prompts';

import {Add} from './add/index.js';

(async () => {
  const response = await prompts({
    type: 'select',
    name: 'type',
    message: 'Command',
    choices: [
      {
        title: 'add',
        value: 'add',
      },
    ],
  });

  switch (response.type) {
    // Should the 'add' value be replaced by an enum value?
    case 'add': {
      Add();
      break;
    }
  }
})();
