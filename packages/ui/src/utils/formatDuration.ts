/**
 * Return the given duration in a HH:MM:SS format.
 *
 * @param duration - The duration in seconds.
 */
export function formatDuration(duration: number) {
  if (duration === Infinity || duration === -Infinity || isNaN(duration)) {
    return '??:??:??';
  }

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60) % 60;
  const seconds = Math.floor(duration % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
