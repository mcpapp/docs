---
title: HTTP Server
description: Mount the MCP Streamable HTTP endpoint with upstream packages.
---

Use MCP Streamable HTTP when the app needs a browser-accessible endpoint such as `/mcp`.

This example follows the upstream json-render MCP server shape: create an MCP server and Streamable HTTP transport for the request, then let the transport handle the framework request and response.

```ts
import { createMcpApp } from "@json-render/mcp";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { readFile } from "node:fs/promises";
import { catalog } from "./catalog";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const expressApp = createMcpExpressApp({ host: "127.0.0.1" });

expressApp.all("/mcp", async (req, res) => {
  const server = createMcpApp({
    name: "customer-ops",
    version: "1.0.0",
    catalog,
    html,
  });

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  res.on("close", () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

expressApp.listen(3000);
```

The endpoint is the standard MCP endpoint that `WebHost` connects to:

```tsx
<WebHost>
  <MCPApp />
</WebHost>
```

## Other server runtimes

Keep the MCP endpoint native to the runtime you are using:

| Runtime | Shape |
| --- | --- |
| Express | Mount the upstream MCP SDK Streamable HTTP transport directly. |
| Fastify | Use a Fastify route or plugin that forwards requests to the MCP SDK transport. |
| Hono | Use a Hono route for `/mcp` or proxy to a standalone MCP Streamable HTTP service. |
| Next.js | Use route handlers for `/api/mcp` or proxy to a standalone MCP Streamable HTTP service. |
| Node HTTP | Use the MCP SDK transport with Node request and response objects. |

The important part is the endpoint contract: MCP Streamable HTTP uses one path that supports `POST` and `GET`. See the [MCP transport spec](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports).

For HTTP servers, keep MCP server and transport state isolated across unrelated clients.
