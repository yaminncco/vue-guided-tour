import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
  base: '/vue-guided-tour/',
  lang: 'en-US',
  title: 'VueGuidedTour',
  description: 'A vue.js 3 component to guide your visitors',
  theme: defaultTheme({
    navbar: [
      {
        text: 'Github',
        link: 'https://github.com/yaminncco/vue-guided-tour',
      },
    ],
    sidebar: ['getting-started', 'config'],
    docsRepo: 'yaminncco/vue-guided-tour',
    lastUpdated: true,
    docsDir: 'docs',
    editLinks: true,
    contributors: false,
  }),
})
