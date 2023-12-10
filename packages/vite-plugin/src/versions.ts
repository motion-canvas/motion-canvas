import fs from 'fs';
import path from 'path';

export function getVersions() {
  return {
    core: loadVersion('@motion-canvas/core'),
    two: loadVersion('@motion-canvas/2d'),
    ui: loadVersion('@motion-canvas/ui'),
    vitePlugin: loadVersion('..'),
  };
}

function loadVersion(module: string): string | null {
  try {
    const modulePath = path.dirname(require.resolve(`${module}/package.json`));
    const packageJsonPath = path.resolve(modulePath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
    return packageJson.version ?? null;
  } catch (_) {
    return null;
  }
}
