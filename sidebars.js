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
      label: 'Client SDKs',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'JavaScript',
          href: '/client-sdk-js/',
        },
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
