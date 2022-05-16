const { path } = require("@vuepress/utils");
const { defaultTheme } = require("@vuepress/theme-default");

module.exports.localTheme = (options) => {
  return {
    name: "vuepress-theme-local",
    extends: defaultTheme(options),
    layouts: {
      Layout: path.resolve(__dirname, "layouts/Layout.vue"),
    },
  };
};
