// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Motion Canvas',
  tagline: 'Visualize complex ideas programmatically',
  url: 'https://motioncanvas.io',
  baseUrl: '/',
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'motion-canvas',
  projectName: 'motion-canvas.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  markdown: {
    mermaid: true,
  },
  customFields: {
    discordApi:
      'https://discord.com/api/guilds/1071029581009657896/widget.json',
    discordUrl: 'https://discord.gg/XnnWTrHYAW',
    githubApi: 'https://api.github.com/repos/motion-canvas/motion-canvas',
    githubUrl: 'https://github.com/motion-canvas/motion-canvas',
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [{name: 'keywords', content: 'typescript, animation, library'}],
      image: 'img/banner.png',
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
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },
          {to: '/api/core', label: 'API', position: 'left'},
          {to: '/blog', label: 'Blog', position: 'left'},
        ],
      },
      footer: {
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: 'docs',
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
              {
                label: 'Discord',
                href: 'https://discord.gg/XnnWTrHYAW',
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
                href: 'https://github.com/motion-canvas/motion-canvas',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Motion Canvas. Built with Docusaurus.`,
      },
      algolia: {
        appId: 'Q6Z7BJ83RF',
        apiKey: '825d6a74e138e6e1378e9669b22720f0',
        indexName: 'motion-canvasio',
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
    '@docusaurus/theme-search-algolia',
    '@docusaurus/theme-mermaid',
  ],
  plugins: [
    './typedoc',
    [
      '@docusaurus/plugin-content-docs',
      {
        routeBasePath: '/docs',
        sidebarPath: 'sidebars.js',
        exclude: ['**/api/core/*.md', '**/api/2d/*.md'],
        showLastUpdateAuthor: true,
        docItemComponent: '@site/src/components/DocPage',
        editUrl: ({versionDocsDirPath, docPath}) =>
          `https://github.com/motion-canvas/motion-canvas/blob/main/packages/docs/${versionDocsDirPath}/${docPath}`,
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        showReadingTime: true,
        editUrl: ({blogDirPath, blogPath}) =>
          `https://github.com/motion-canvas/motion-canvas/blob/main/packages/docs/${blogDirPath}/${blogPath}`,
      },
    ],
    '@docusaurus/plugin-content-pages',
    '@docusaurus/plugin-debug',
    '@docusaurus/plugin-sitemap',
    [
      './editor',
      {
        examples: [
          {
            name: 'random',
            url: 'Random values generator',
          },
          {
            name: 'quickstart',
            url: 'Quickstart example',
          },
          {
            name: 'logging',
            url: 'Logging example',
          },
        ],
      },
    ],
  ],
};

module.exports = config;
