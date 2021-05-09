const { build } = require("esbuild");
const sassPlugin = require("esbuild-plugin-sass");
const path = require("path");

build({
  entryPoints: [path.resolve(__dirname, "src/index.tsx")],
  minify: process.env.NODE_ENV === "production",
  bundle: true,
  target: "es2015",
  outbase: path.resolve(__dirname, "src"),
  outdir: path.resolve(__dirname, "dist"),
  platform: "browser",
  watch: process.env.NODE_ENV !== "production",
  sourcemap: process.env.NODE_ENV !== "production",
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
  plugins: [sassPlugin()],
}).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});
