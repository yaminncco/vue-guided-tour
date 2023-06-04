import { defineClientConfig } from '@vuepress/client'
import Tour from './components/Tour.vue'
import VueGuidedTour from '../../src'

export default defineClientConfig({
  enhance({ app }) {
    app.use(VueGuidedTour)
  },
  rootComponents: [Tour as any],
})
