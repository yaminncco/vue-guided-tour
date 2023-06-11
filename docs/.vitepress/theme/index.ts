import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Tour from '../components/Tour.vue'
import VueGuidedTour from '../../../src'

const theme: Theme = {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(Tour),
    })
  },
  enhanceApp({ app }) {
    app.use(VueGuidedTour as any)
  },
}

export default theme
