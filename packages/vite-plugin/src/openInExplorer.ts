import {spawn} from 'child_process';
import {platform} from 'os';

export function openInExplorer(file: string) {
  let explorer: string | null = null;
  const os = platform();
  switch (os) {
    case 'win32':
      explorer = 'explorer';
      break;
    case 'linux':
      explorer = 'xdg-open';
      break;
    case 'darwin':
      explorer = 'open';
      break;
  }

  if (explorer) {
    spawn(explorer, [file], {detached: true}).unref();
  } else {
    console.warn(`Unsupported OS: ${os}`);
  }
}
