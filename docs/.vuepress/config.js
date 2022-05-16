const { defineUserConfig } = require("vuepress");
const { localTheme } = require("./theme");

module.exports = defineUserConfig({
  base: "/vue-guided-tour/",
  lang: "en-US",
  title: "VueGuidedTour",
  description: "A vue.js 3 component to guide your visitors",
  theme: localTheme({
    navbar: [
      {
        text: "Github",
        link: "https://github.com/yaminncco/vue-guided-tour",
      },
    ],
    sidebar: {
      "/": [
        {
          title: "Getting Started",
          children: ["getting-started"],
        },
        {
          title: "Config",
          children: ["config"],
        },
      ],
    },
    docsRepo: 'yaminncco/vue-guided-tour',
    lastUpdated: true,
    editLinks: true,
    contributors: false
  }),
});
