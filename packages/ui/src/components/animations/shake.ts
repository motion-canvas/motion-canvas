export function shake(distancePixels = 2) {
  const easing = getComputedStyle(document.documentElement).getPropertyValue(
    '--timing-ease-in-out',
  );
  return [
    {translate: '0px'},
    {
      translate: `-${distancePixels}px`,
      easing,
    },
    {
      translate: `${distancePixels}px`,
      easing,
    },
    {
      translate: `-${distancePixels}px`,
      easing,
    },
    {
      translate: `${distancePixels}px`,
      easing,
    },
    {translate: '0px'},
  ];
}
