import * as fs from 'fs';
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
    await app.page.waitForSelector('#render:not([data-rendering="true"])');

    const images = await readOutputFiles();
    for (const {name, content} of images) {
      expect(content).toMatchImageSnapshot({
        customSnapshotIdentifier: name,
      });
    }
  });
});

async function readOutputFiles() {
  const files = await fs.promises.readdir('./output/project');
  const images = await Promise.all(
    files.map(async file => {
      const stat = await fs.promises.stat(`./output/project/${file}`);
      return stat.isDirectory()
        ? {
            name: file,
            content: await fs.promises.readFile(
              `./output/project/${file}/000000.png`,
            ),
          }
        : null;
    }),
  );

  return images.filter(image => image !== null);
}
