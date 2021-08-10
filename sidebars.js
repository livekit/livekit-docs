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
        {
          type: 'category',
          label: 'Room Basics',
          collapsed: true,
          items: [
            'guides/room/connect',
            'guides/room/publish',
            'guides/room/receive',
            'guides/room/data',
          ],
        },
        'guides/access-tokens',
        'guides/server-api',
        'guides/webhooks',
        // 'guides/recording',
        {
          type: 'category',
          label: 'Deployment',
          collapsed: true,
          items: [
            'guides/deploy',
            'guides/deploy/tuning',
            'guides/deploy/kubernetes',
            'guides/deploy/benchmark',
            // 'guides/deploy/recorder',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsed: false,
      items: [
       'references/client-sdks',
       'references/server-sdks',
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
