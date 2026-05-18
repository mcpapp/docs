import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeNext from "starlight-theme-next";

export default defineConfig({
  output: "static",
  integrations: [
    starlight({
      title: "MCPApp",
      description:
        "A minimal MCP App runtime over json-render specs.",
      plugins: [starlightThemeNext()],
      logo: {
        src: "./public/favicon.svg",
      },
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/" }],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "introduction" },
            { label: "Quick Start", slug: "quick-start" },
            { label: "Architecture", slug: "architecture" },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Spec", slug: "specs" },
            { label: "Registry", slug: "registry" },
            { label: "Type Safety", slug: "type-safety" },
            { label: "Actions", slug: "actions" },
            { label: "State", slug: "state" },
            { label: "Server-Side Rendering", slug: "server-side-rendering" },
          ],
        },
        {
          label: "Examples",
          items: [
            { label: "Overview", slug: "examples" },
            { label: "Native MCP App", slug: "examples/native-mcp-app" },
            { label: "Standalone Web", slug: "examples/web-host" },
            { label: "WebHost SSR", slug: "examples/webhost-ssr" },
            { label: "Next App SSR", slug: "examples/next-ssr" },
            { label: "Custom Registry", slug: "examples/custom-registry" },
            { label: "Typed Stack", slug: "examples/typed-stack" },
            { label: "Actions + XState", slug: "examples/xstate-actions" },
            { label: "Sync Store", slug: "examples/sync-store" },
            { label: "Local Server", slug: "examples/local-server" },
            { label: "HTTP Server", slug: "examples/http-server" },
            { label: "Static Serving", slug: "examples/static-serving" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "MCPApp", slug: "mcp-apps" },
            { label: "WebHost", slug: "standalone-web" },
          ],
        },
        {
          label: "Roadmap",
          items: [
            { label: "Next", link: "/roadmap/next/" },
            { label: "Future", slug: "future-targets" },
          ],
        },
      ],
    }),
  ],
});
