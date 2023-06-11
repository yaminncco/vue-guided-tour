import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/vue-guided-tour/',
  lang: 'en-US',
  title: 'VueGuidedTour',
  description: 'A vue.js 3 component to guide your visitors',
  themeConfig: {
    nav: [
      {
        text: 'Github',
        link: 'https://github.com/yaminncco/vue-guided-tour',
      },
    ],
    sidebar: [
      {
        text: 'Getting started',
        link: '/getting-started',
      },
      {
        text: 'Config',
        link: '/config',
      },
    ],
  },
})
