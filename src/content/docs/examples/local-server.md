---
title: Local Server
description: Serve an MCP App with upstream json-render and MCP SDK packages.
---

Use upstream server packages directly.

```ts
import { createMcpApp } from "@json-render/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFile } from "node:fs/promises";
import { catalog } from "./catalog";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

const server = createMcpApp({
  name: "customer-ops",
  version: "1.0.0",
  catalog,
  html,
});

await server.connect(new StdioServerTransport());
```

The server owns the catalog and app resource. The app resource contains the client bundle that renders `<MCPApp />`.

## App resource

The app resource is ordinary bundled HTML.

```tsx
import { MCPApp } from "@mcpapp/react";

export function App() {
  return <MCPApp />;
}
```

Bundle that app with your build tool, then pass the built HTML to `createMcpApp`.

## Spec sources

The functions in [Spec](/specs/) are app code. Call them from whichever MCP tool or resource flow you build around `@json-render/mcp`.

Use upstream [`@json-render/mcp`](https://json-render.dev/docs/api/mcp) for tool and resource APIs.
