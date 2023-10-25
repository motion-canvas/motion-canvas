export function borderHighlight(): Keyframe[] {
  return [
    {
      borderColor: 'var(--theme)',
      easing: 'cubic-bezier(0.32, 0, 0.67, 0)',
    },
    {},
  ];
}
