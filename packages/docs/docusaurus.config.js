// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Motion Canvas',
  tagline: 'Create animations programmatically',
  url: 'https://motion-canvas.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'motion-canvas',
  projectName: 'motion-canvas.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
      },
      navbar: {
        title: 'Motion Canvas',
        logo: {
          alt: 'Motion Canvas Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo_dark.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'guides',
            position: 'left',
            label: 'Guides',
          },
          {to: '/api/core', label: 'API', position: 'left'},
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/motion-canvas',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Guides',
                to: 'guides/intro',
              },
              {
                label: 'API',
                to: 'api/core',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Patreon',
                href: 'https://patreon.com/aarthificial',
              },
              {
                label: 'YouTube',
                href: 'https://youtube.com/aarthificial',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/motion-canvas',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Motion Canvas. Built with Docusaurus.`,
      },
      prism: {
        theme: require('./config/lightCodeTheme'),
        darkTheme: require('./config/darkCodeTheme'),
      },
    }),
  themes: [
    [
      '@docusaurus/theme-classic',
      {
        customCss: require.resolve('./src/css/custom.css'),
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        routeBasePath: '/',
        sidebarPath: 'sidebars.js',
        exclude: ['**/api/core/*.md', '**/api/2d/*.md'],
        showLastUpdateAuthor: true,
        editUrl: ({versionDocsDirPath, docPath}) =>
          `https://github.com/motion-canvas/motion-canvas/blob/main/${versionDocsDirPath}/${docPath}`,
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        showReadingTime: true,
        editUrl: ({blogDirPath, blogPath}) =>
          `https://github.com/motion-canvas/motion-canvas/blob/main/${blogDirPath}/${blogPath}`,
      },
    ],
    '@docusaurus/plugin-content-pages',
    '@docusaurus/plugin-debug',
    '@docusaurus/plugin-sitemap',
    require('./typedoc'),
  ],
};

module.exports = config;
