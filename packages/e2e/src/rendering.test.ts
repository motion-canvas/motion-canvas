import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {toMatchImageSnapshot} from 'jest-image-snapshot';
import {App, start} from './app';
import {readFileSync} from 'fs';

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
    await app.page.waitForSelector('#render:not([data-rendering="true"])');

    expect(readFileSync('./output/project/000300.png')).toMatchImageSnapshot();
  });
});
