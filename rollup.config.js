/* eslint-disable import/no-anonymous-default-export */
import typescript from "rollup-plugin-typescript2";
import bundleSize from "rollup-plugin-bundle-size";
import terser from "@rollup/plugin-terser";

import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [{ file: pkg.module, format: "esm" }],
    plugins: [typescript(), terser(), bundleSize()],
    external: Object.keys(pkg.peerDependencies || {}),
  },
];
