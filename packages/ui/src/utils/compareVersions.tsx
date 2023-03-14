export function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.split('.');
  const v2Parts = v2.split('.');
  const len = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < len; i++) {
    const v1Part = getNumericPart(v1Parts[i]);
    const v2Part = getNumericPart(v2Parts[i]);

    if (v1Part === v2Part) {
      const v1Pre = getPreReleasePart(v1Parts[i]);
      const v2Pre = getPreReleasePart(v2Parts[i]);

      if (v1Pre && v2Pre && v1Pre !== v2Pre) {
        return v1Pre.localeCompare(v2Pre);
      } else if (v1Pre && !v2Pre) {
        return -1;
      } else if (!v1Pre && v2Pre) {
        return 1;
      }
    } else {
      return v1Part > v2Part ? 1 : -1;
    }
  }

  return 0;
}

function getNumericPart(part: string): string | number {
  const numPart = parseInt(part, 10);
  return isNaN(numPart) ? part : numPart;
}

function getPreReleasePart(part: string): string {
  if (!part) {
    return null;
  }
  const preReleaseMatch = part.match(/-([0-9A-Za-z-.]+)/);
  return preReleaseMatch ? preReleaseMatch[1] : null;
}
