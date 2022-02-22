import VueGuidedTour from "./components/vueGuidedTour.vue";
import VueGuidedOverlay from "./components/vueGuidedOverlay.vue";
import VueGuidedPopover from "./components/vueGuidedPopover.vue";
import useRect from "./use/useRect";

const vgtPlugin = {
  install(app) {
    const $vgt = {};
    app.config.globalProperties.$vgt = $vgt;
    app.provide("$vgt", $vgt);
    app.component("VueGuidedTour", VueGuidedTour);
  },
};

export default vgtPlugin;
export { VueGuidedTour, VueGuidedOverlay, VueGuidedPopover, useRect };
