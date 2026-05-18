---
title: Native MCP App
description: A minimal app view for native MCP Apps hosts.
---

Use this shape for ChatGPT, Codex, Claude, Cursor, VS Code, and other hosts that support MCP Apps.

```tsx
import { MCPApp } from "@mcpapp/react";

export function App() {
  return <MCPApp />;
}
```

The host loads the app resource from the MCP server. `MCPApp` receives the active json-render spec and renders it with the resolved registry.

## With app identity

Most apps can use package metadata. Pass `name` and `version` when you need explicit identity.

```tsx
export function App() {
  return <MCPApp name="customer-ops" version="1.0.0" />;
}
```

## Server shape

Pair the app view with the server helper.

```ts
import { createMcpApp } from "@json-render/mcp";
import { readFile } from "node:fs/promises";
import { catalog } from "./catalog";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

export const server = createMcpApp({
  name: "customer-ops",
  version: "1.0.0",
  catalog,
  html,
});
```

See [Local Server](/examples/local-server/) for the full server shape.
