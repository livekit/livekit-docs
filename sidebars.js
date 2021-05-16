module.exports = {
  sidebar: [
    {
      type: 'doc',
      id: 'index',
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/getting-started',
        'guides/access-tokens',
        'guides/deployment',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsed: false,
      items: [
       'references/client-sdks',
       'references/server-apis',
      ]
    },
    {
      type: 'category',
      label: 'Internals',
      items: [
        'internals/client-protocol',
      ]
    }
  ],
};
