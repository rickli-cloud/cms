import { type Config, serializeConfig } from "@lucarickli/jamstack-cms/utils";
import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";
// import { spawn } from "node:child_process";

const virtualModuleId = "virtual:jamstack-cms";

export function jamstackCmsPlugin(
  cfg: Config,
  adminPath: string = "/admin"
): AstroIntegration {
  // let proxy: ReturnType<typeof spawn>;

  if (!/^\//.test(adminPath)) {
    throw new Error(
      `'adminPath' option must be a root-relative pathname, starting with "/", got "${adminPath}"`
    );
  }

  if (/\/$/.test(adminPath)) {
    adminPath = adminPath.slice(0, -1);
  }

  return {
    name: "jamstack-cms-astro-plugin",
    hooks: {
      "astro:config:setup": ({ config, injectRoute, updateConfig }) => {
        updateConfig({
          site: config.site || process.env.URL,
          vite: {
            ...config.vite,
            plugins: [
              ...(config.vite.plugins || []),
              jamstackCmsVitePlugin(serializeConfig(cfg)),
            ],
          },
        });

        injectRoute({
          pattern: adminPath,
          entrypoint: "@lucarickli/jamstack-cms-astro/admin.astro",
          // entrypoint: "../admin.astro",
        });
      },

      "astro:server:start": () => {
        // proxy = spawn("npx", ["proxy-server"], {
        //   stdio: "inherit",
        //   // Run in shell on Windows to make sure the npm package can be found.
        //   shell: process.platform === "win32",
        // });
        // process.on("exit", () => proxy.kill());
      },

      "astro:server:done": () => {
        // proxy.kill();
      },
    },
  };
}

/**
 * Virtual module to provide cms configuration.
 * @see {@link https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention}
 */
export function jamstackCmsVitePlugin(cfg: Config): Plugin {
  return {
    name: "jamstack-cms-vite-plugin",

    resolveId(id) {
      if (id === virtualModuleId) {
        return "\0" + virtualModuleId;
      }
    },

    load(id) {
      if (id === "\0" + virtualModuleId) {
        return `export default JSON.parse(\`${JSON.stringify(
          serializeConfig(cfg)
        )}\`);`;
      }
    },
  };
}
