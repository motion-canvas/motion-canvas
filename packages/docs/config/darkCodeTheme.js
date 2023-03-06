const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

module.exports = {
  ...darkCodeTheme,
  plain: {
    color: '#f8f8f8',
    backgroundColor: 'var(--code-background-color)',
  },
  styles: [
    ...darkCodeTheme.styles,
    {
      types: ['constant'],
      style: {
        color: 'rgb(184,165,232)',
      },
    },
  ],
};
