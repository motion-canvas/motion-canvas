// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  guides: [{type: 'autogenerated', dirName: 'guides'}],
  api: [
    {
      type: 'category',
      label: 'Modules',
      collapsed: false,
      link: {
        type: 'generated-index',
      },
      items: [{type: 'autogenerated', dirName: 'api/modules'}],
    },
    {
      type: 'category',
      label: 'Classes',
      link: {
        type: 'generated-index',
      },
      items: [{type: 'autogenerated', dirName: 'api/classes'}],
    },
    {
      type: 'category',
      label: 'Enumerations',
      link: {
        type: 'generated-index',
      },
      items: [{type: 'autogenerated', dirName: 'api/enums'}],
    },
    {
      type: 'category',
      label: 'Interfaces',
      link: {
        type: 'generated-index',
      },
      items: [{type: 'autogenerated', dirName: 'api/interfaces'}],
    },
  ],
};

module.exports = sidebars;
