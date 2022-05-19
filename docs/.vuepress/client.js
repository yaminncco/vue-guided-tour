import { defineClientConfig } from "@vuepress/client";
import Tour from "./components/Tour.vue";
import VueGuidedTour from "../../src/index";

export default defineClientConfig({
  enhance({ app }) {
    app.use(VueGuidedTour);
  },
  rootComponents: [Tour],
});
