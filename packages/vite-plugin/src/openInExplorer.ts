import {execSync, spawn} from 'child_process';
import {platform} from 'os';

export function openInExplorer(file: string) {
  let command: string | null = null;
  let args = [file];
  const os = platform();

  switch (os) {
    case 'win32':
      command = 'explorer';
      break;
    case 'linux':
      if (isRunningOnWSL()) {
        command = 'bash';
        args = ['-c', `cd ${file} && explorer.exe .`];
      } else {
        command = 'xdg-open';
      }
      break;
    case 'darwin':
      command = 'open';
      break;
  }

  if (command) {
    spawn(command, args, {detached: true}).unref();
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
