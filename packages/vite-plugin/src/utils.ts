import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';
import {ProjectData} from './plugins';

export async function createMeta(metaPath: string) {
  if (!fs.existsSync(metaPath)) {
    await fs.promises.writeFile(
      metaPath,
      JSON.stringify({version: 0}, undefined, 2),
      'utf8',
    );
  }
}

export function getProjects(project: string | string[]): ProjectData[] {
  const list: ProjectData[] = [];
  const projectList = expandFilePaths(project);
  for (const url of projectList) {
    const {name, dir} = path.posix.parse(url);
    const metaFile = `${name}.meta`;
    const metaData = getMeta(path.join(dir, metaFile));
    const data = {name: metaData?.name ?? name, fileName: name, url};
    list.push(data);
  }

  return list;
}

function expandFilePaths(filePaths: string[] | string): string[] {
  const expandedFilePaths = [];

  for (const filePath of typeof filePaths === 'string'
    ? [filePaths]
    : filePaths) {
    if (fg.isDynamicPattern(filePath)) {
      const matchingFilePaths = fg.sync(filePath, {onlyFiles: true});
      expandedFilePaths.push(...matchingFilePaths);
    } else {
      expandedFilePaths.push(filePath);
    }
  }

  return expandedFilePaths;
}

function getMeta(metaPath: string) {
  if (fs.existsSync(metaPath)) {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  }
}
