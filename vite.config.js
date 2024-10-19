
import inject from "@rollup/plugin-inject";
import { resolve } from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
  base: "./",
  publicDir: false,
  build: {
    outDir: "./dist",
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        homeOne: resolve(__dirname, "./index.html"),
        wishlist: resolve(__dirname, "./wishlist.html"),
        bookDetails: resolve(__dirname, "./book-details.html"),
      },
      output: {
        chunkFileNames: "assets/js/[name].js",

        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? "")) {
            return "assets/images/[name]-[hash][extname]";
          }

          if (/\.css$/.test(name ?? "")) {
            return "assets/css/[name][extname]";
          }

          return "assets/[name]-[hash][extname]";
        },
      },
    },
    minify: false,
  },
  plugins: [
    inject({
      $: "jquery",
      jQuery: "jquery",
    }),
    handlebars({
      partialDirectory: ["src/partials"],
    }),
  ],
});
