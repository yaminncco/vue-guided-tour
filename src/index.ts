import { Plugin } from 'vue'
import VueGuidedTour from './components/Tour.vue'
import VueGuidedOverlay from './components/Overlay.vue'
import VueGuidedPopover from './components/Popover.vue'
import { useRect, useVgt, vgtInjectionKey } from './use'
import { Vgt } from './types'

const vgtPlugin: Plugin = {
  install(app) {
    const $vgt = {} as Vgt
    app.config.globalProperties.$vgt = $vgt
    app.provide(vgtInjectionKey, $vgt)
    app.component('VueGuidedTour', VueGuidedTour)
  },
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $vgt: Vgt
  }
  export interface GlobalComponents {
    VueGuidedTour: typeof VueGuidedTour
  }
}

export default vgtPlugin
export { VueGuidedOverlay, VueGuidedPopover }
export { useRect, useVgt }
export {
  vueGuidedTourProps,
  vueGuidedOverlayProps,
  vueGuidedPopoverProps,
} from './props'
export * from './types'
