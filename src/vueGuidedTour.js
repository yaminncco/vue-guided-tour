import VueGuidedTour from './components/vueGuidedTour.vue'

export default {
  install(app) {
    const $vgt = {}
    app.config.globalProperties.$vgt = $vgt
    app.provide('$vgt', $vgt)
    app.component('VueGuidedTour', VueGuidedTour)
  }
}
