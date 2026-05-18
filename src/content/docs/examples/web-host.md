---
title: Standalone Web
description: Run the same MCPApp in a regular browser page.
---

Use `WebHost` when the page is running in a browser rather than a native MCP Apps host.

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

`WebHost` connects to the MCP endpoint, loads the app resource, and provides the browser host context.

## Route context

Pass route context with `initialArgs`.

```tsx
export function CustomerPage({ customerId }: { customerId: string }) {
  return (
    <WebHost initialArgs={{ customerId }}>
      <MCPApp />
    </WebHost>
  );
}
```

The server decides what to render for that context.

## Custom endpoint

`/mcp` is the default. Use `endpoint` when your app mounts the MCP server somewhere else.

```tsx
<WebHost endpoint="/api/mcp">
  <MCPApp />
</WebHost>
```
