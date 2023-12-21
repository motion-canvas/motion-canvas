import {readFileSync} from 'fs';
import {toMatchImageSnapshot} from 'jest-image-snapshot';
import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {App, start} from './app';

expect.extend({toMatchImageSnapshot});

describe('Rendering', () => {
  let app: App;

  beforeAll(async () => {
    app = await start();
  });

  afterAll(async () => {
    await app.stop();
  });

  test('Animation renders correctly', async () => {
    await app.page.click('#render');
    await app.page.waitForSelector('#render:not([data-rendering="true"])', {
      timeout: 60000,
    });

    expect(readFileSync('./output/project/000300.png')).toMatchImageSnapshot();
  });
});
