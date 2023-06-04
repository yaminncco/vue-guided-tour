import { defineClientConfig } from '@vuepress/client'
import Tour from './components/Tour.vue'
import VueGuidedTour from '../../src'
import DemoExample from './components/DemoExample.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.use(VueGuidedTour)
    app.component('DemoExample', DemoExample)
  },
  rootComponents: [Tour as any],
})
