---
title: Static Serving
description: Build and serve the MCP App HTML as a static resource.
---

The app HTML can be static even when the server is dynamic.

Use your bundler to produce the app JavaScript and CSS, then use upstream `buildAppHtml` to create the self-contained MCP App resource.

```ts
import { buildAppHtml } from "@json-render/mcp/app";
import { readFile, writeFile } from "node:fs/promises";

const html = buildAppHtml({
  title: "Customer Ops",
  js: await readFile("dist/app.js", "utf8"),
  css: await readFile("dist/app.css", "utf8"),
});

await writeFile("dist/app.html", html);
```

Serve that HTML through the MCP resource registration.

```ts
import { createMcpApp } from "@json-render/mcp";
import { readFile } from "node:fs/promises";
import { catalog } from "./catalog";

const html = await readFile("dist/app.html", "utf8");

export const server = createMcpApp({
  name: "customer-ops",
  version: "1.0.0",
  catalog,
  html,
});
```

## Read-only demos

For a read-only demo, pair static app HTML with a hand-authored spec from [Spec](/specs/). The static artifact can render the app and local view state. Server actions, tool calls, live generation, and streaming still need an MCP server.
