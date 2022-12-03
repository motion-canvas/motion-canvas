export function shake(distancePixels = 2) {
  return [
    {translate: '0px'},
    {
      translate: `-${distancePixels}px`,
      easing: 'ease-in-out',
    },
    {
      translate: `${distancePixels}px`,
      easing: 'ease-in-out',
    },
    {
      translate: `-${distancePixels}px`,
      easing: 'ease-in-out',
    },
    {
      translate: `${distancePixels}px`,
      easing: 'ease-in-out',
    },
    {translate: '0px'},
  ];
}
