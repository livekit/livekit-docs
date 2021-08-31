const repoUrl = 'https://github.com/livekit/livekit-server'

module.exports = {
  title: 'docs',
  tagline: 'LiveKit Documentation',
  url: 'https://docs.livekit.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'livekit',
  projectName: 'docs',
  themeConfig: {
    navbar: {
      title: 'docs',
      logo: {
        alt: 'LiveKit Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://livekit.io',
          label: 'Home',
          position: 'right',
        },
        {
          href: repoUrl,
          label: 'GitHub',
          position: 'right',
          className: 'github',
        },
        {
          href: 'https://livekit.io/playground',
          label: 'Playground',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LiveKit`,
    },
    colorMode: {
      respectPrefersColorScheme: false,
      defaultMode: 'light',
      disableSwitch: true,
    },
    prism: {
      theme: require('./themes/livekit'),
      additionalLanguages: ["swift", "kotlin", "go", "groovy", "ini", "dart"],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      },
    ],
  ],
};
