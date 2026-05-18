---
title: Quick Start
description: Build the smallest app shape.
---

This guide shows the intended application shape. The exact package names may change before the first release, but the contract should stay this small.

## Install

```bash
npm install @mcpapp/react @json-render/react @json-render/mcp @modelcontextprotocol/sdk
```

For a browser target, add the web registry package:

```bash
npm install @json-render/shadcn
```

## Native MCP App

Create the app view that runs inside a native MCP Apps host.

```tsx
import { MCPApp } from "@mcpapp/react";

export function App() {
  return <MCPApp />;
}
```

`MCPApp` reads the active spec from the MCP Apps bridge, initializes json-render state from the spec, and renders it with the resolved registry.

## Browser App

Use `WebHost` when the app runs in a normal browser page.

```tsx
import { MCPApp, WebHost } from "@mcpapp/react";

export function App() {
  return (
    <WebHost>
      <MCPApp />
    </WebHost>
  );
}
```

`WebHost` provides the host side for the browser. The default endpoint is `/mcp`.

## Server

Create the MCP server with upstream json-render and MCP SDK packages.

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

See [Local Server](/examples/local-server/) for stdio and [HTTP Server](/examples/http-server/) for Streamable HTTP.

## Next

- [Architecture](/architecture/) explains the layering.
- [Examples](/examples/) shows common app shapes.
- [MCP App reference](/mcp-apps/) lists the component props.
- [Web Host reference](/standalone-web/) covers browser-specific options.
