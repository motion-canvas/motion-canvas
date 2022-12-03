export function highlight(sizePixels = 4) {
  return [
    {
      boxShadow: '0 0 0px 0 #ccc inset',
      easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
    },
    {
      boxShadow: `0 0 0px ${sizePixels}px #ccc inset`,
      easing: 'cubic-bezier(0.32, 0, 0.67, 0)',
    },
    {boxShadow: '0 0 0px 0 #ccc inset'},
  ];
}
