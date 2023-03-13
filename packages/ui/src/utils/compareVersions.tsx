export function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.split('.');
  const v2Parts = v2.split('.');
  const len = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < len; i++) {
    const v1Part = parseInt(v1Parts[i] || '0', 10);
    const v2Part = parseInt(v2Parts[i] || '0', 10);
    if (v1Part > v2Part) {
      return 1;
    }
    if (v1Part < v2Part) {
      return -1;
    }
  }

  return 0;
}
