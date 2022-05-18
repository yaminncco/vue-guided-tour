import { defineClientAppEnhance } from "@vuepress/client";
import VueGuidedTour from "../../../src/index";

export default defineClientAppEnhance(({ app }) => {
  app.use(VueGuidedTour);
});
