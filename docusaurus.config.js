// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/vsDark");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "jzhmcoo1",
  tagline: "👨🏻‍💻好好学习，天天敲代码👩🏻‍💻",
  url: "https://blog.lihangzhu.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "jzhmcoo1", // Usually your GitHub org/user name.
  projectName: "personal-docs-and-blog", // Usually your repo name.

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/jzhmcoo1/personal-docs-and-blog/edit/main/website/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/jzhmcoo1/personal-docs-and-blog/edit/main/website/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "jzhmcoo1",
        logo: {
          alt: "My Site Logo",
          src: "img/avatar.jpeg",
        },
        items: [
          {
            type: "doc",
            docId: "fe-intro",
            position: "left",
            label: "前端",
          },
          { to: "/blog", label: "博客", position: "left" },
          {
            href: "https://github.com/jzhmcoo1/personal-docs-and-blog",
            position: "right",
            className: "header-github-link",
          },
          {
            type: "search",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "前端",
                to: "/docs/fe-intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/docusaurus",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/docusaurus",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/docusaurus",
              },
            ],
          },
          {
            title: "联系我",
            items: [
              {
                label: "Github",
                href: "https://github.com/jzhmcoo1",
              },
              {
                label: "Gitee",
                href: "https://gitee.com/jzhmcoo1",
              },
              {
                label: "掘金",
                href: "https://juejin.cn/user/2964702570488312",
              },
            ],
          },
          {
            title: "友情链接",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/facebook/docusaurus",
              },
              {
                label: "Docusaurus",
                href: "https://github.com/facebook/docusaurus",
              },
              {
                label: "Vercel",
                href: "https://vercel.com/",
              },
              {
                label: "Slidev",
                href: "https://sli.dev/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} jzhmcoo1. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      algolia: {
        // If Algolia did not provide you any appId, use 'BH4D9OD16A'
        appId: "ZNUM42B70I",

        // Public API key: it is safe to commit it
        apiKey: "f53a05d9fa1237b3ecf063dbb4ffc16e",

        indexName: "blog_lihangzhu",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Algolia search parameters
        searchParameters: {},

        //... other Algolia params
      },
    }),
};

module.exports = config;
