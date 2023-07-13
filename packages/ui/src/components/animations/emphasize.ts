export function emphasize(distancePixels = 4) {
  return [
    {
      translate: '0 0',
      easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
    },
    {
      translate: `0 -${distancePixels}px`,
      easing: 'cubic-bezier(0.34, 3, 0.64, 1)',
    },
    {
      translate: `0 0`,
    },
  ];
}
