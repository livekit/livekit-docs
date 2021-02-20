module.exports = {
  sidebar: [
    {
      type: 'doc',
      id: 'index',
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/getting-started',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsed: false,
      items: [
       'references/client-sdks',
      ]
    },
    // {
    //   type: 'category',
    //   label: 'Server SDKs',
    //   collapsed: false,
    //   items: [
    //     {
    //       type: 'link',
    //       label: 'JavaScript',
    //       href: '/server-api-js',
    //     },
    //   ]
    // }
  ],
};
