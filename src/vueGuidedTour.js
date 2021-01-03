import VueGuidedTour from './components/vueGuidedTour.vue'

export default {
  install(app) {
    app.component('vue-guided-tour', VueGuidedTour)
  }
}
