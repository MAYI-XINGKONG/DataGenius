import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, loadEnv, ConfigEnv } from "vite";
import { rmSync } from "node:fs";
import renderer from "vite-plugin-electron-renderer";
import path from "node:path";
import electron from "vite-plugin-electron";
import pkg from "./package.json";

// import vueSetupExtend from 'vite-plugin-vue-setup-extend';

const pathResolve = (dir: string) => {
  return resolve(__dirname, ".", dir);
};

const alias: Record<string, string> = {
  "/@": pathResolve("./src/"),
};
export default defineConfig(({ command }) => {
  rmSync("dist-electron", { recursive: true, force: true });

  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    resolve: {
      alias: {
        "@": path.join(__dirname, "src"),
      },
    },
    plugins: [
      vue(),
      electron([
        {
          //Electron应用程序的主进程入口文件。
          entry: "electron/main/index.ts",
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */ "[startup] Electron App"
              );
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys(
                  "dependencies" in pkg ? pkg.dependencies : {}
                ),
              },
            },
          },
        },
        {
          entry: "electron/preload/index.js",
          onstart(options) {
            // 当预加载脚本构建完成时，通知渲染器进程重新加载页面，而不是重新启动整个Electron应用程序。
            options.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : undefined, // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys(
                  "dependencies" in pkg ? pkg.dependencies : {}
                ),
              },
            },
          },
        },
        {
          entry: "electron/db/sqliteService.js", // 添加此项以打包 sqliteService.ts
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/db",
              rollupOptions: {
                external: Object.keys(
                  "dependencies" in pkg ? pkg.dependencies : {}
                ),
              },
            },
          },
        },
      ]),
      // 在渲染器进程中使用Node.js API
      renderer(),
    ],
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
        };
      })(),
    clearScreen: false
  };
});
