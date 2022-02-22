import vue from "rollup-plugin-vue";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const plugins = [
  vue(),
  resolve(),
  commonjs(),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    presets: ["@babel/preset-env"],
  }),
  postcss(),
];

export default {
  input: "src/index.js",
  external: ["vue"],
  output: [
    {
      file: pkg.module,
      format: "es",
      exports: "named",
    },
    {
      file: pkg.main,
      format: "umd",
      exports: "named",
      name: "VueGuidedTour",
      globals: {
        vue: "Vue",
      },
    },
    {
      file: pkg.unpkg,
      format: "iife",
      exports: "named",
      name: "VueGuidedTour",
      globals: {
        vue: "Vue",
      },
      plugins: [terser()],
    },
  ],
  plugins,
};
