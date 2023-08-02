import {execSync, spawn} from 'child_process';
import {platform} from 'os';
import {existsSync, mkdirSync} from 'fs';

export function openInExplorer(file: string) {
  let explorer: string | null = null;
  const os = platform();

  if (!existsSync(file)) {
    mkdirSync(file, {recursive: true});
  }

  switch (os) {
    case 'win32':
      explorer = 'explorer';
      break;
    case 'linux':
      if (isRunningOnWSL()) {
        explorer = 'bash';
        file = `cd ${file} && explorer.exe .`;
      } else {
        explorer = 'xdg-open';
      }
      break;
    case 'darwin':
      explorer = 'open';
      break;
  }

  if (explorer === 'bash') {
    spawn(explorer, ['-c', file], {detached: true}).unref();
  } else if (explorer) {
    spawn(explorer, [file], {detached: true}).unref();
  } else {
    console.warn(`Unsupported OS: ${os}`);
  }
}

function isRunningOnWSL(): boolean {
  try {
    const uname = execSync('uname -a').toString().toLowerCase();
    return uname.includes('microsoft');
  } catch (error) {
    console.error(`exec error: ${error}`);
    return false;
  }
}
