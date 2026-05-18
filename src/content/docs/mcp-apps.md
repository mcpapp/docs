---
title: MCPApp
description: API reference for the base MCP App component.
---

`MCPApp` is the base app view. In a native MCP Apps host, it is the only component the client needs.

```tsx
import { MCPApp } from "@mcpapp/react";

<MCPApp />
```

Inside a browser adapter:

```tsx
import { MCPApp, WebHost } from "@mcpapp/react";

<WebHost>
  <MCPApp />
</WebHost>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | package/app metadata | App name used when connecting to the MCP Apps bridge. |
| `version` | `string` | package/app metadata | App version used when connecting to the MCP Apps bridge. |
| `registry` | `Registry` | resolved from host context | Explicit json-render registry for custom product components. |
| `handlers` | `ActionHandlers` | `{}` | Optional handlers for spec-declared actions. |
| `state` | `StateAdapter` | spec state | Optional controlled state adapter. |
| `loading` | `ReactNode` | default loading UI | Custom loading view while the first spec is resolving. |
| `error` | `(error: Error) => ReactNode` | default error UI | Custom error renderer. |

## Basic usage

```tsx
<MCPApp />
```

## Explicit identity

```tsx
<MCPApp name="customer-ops" version="1.0.0" />
```

## Custom registry

```tsx
<MCPApp registry={registry} />
```

## Action handlers

```tsx
<MCPApp handlers={handlers} />
```

See [Actions](/actions/) for the handler model.

## Controlled state

```tsx
<MCPApp state={stateAdapter} />
```

See [State](/state/) for controlled state.

## Registry resolution

`MCPApp` resolves a registry in this order:

1. `registry` prop,
2. nearest host context,
3. runtime package default,
4. configuration error.

See [Registry](/registry/) for default web registries and custom registries.

## Server pairing

Pair `MCPApp` with upstream MCP App server wiring:

```ts
import { createMcpApp } from "@json-render/mcp";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");

export const server = createMcpApp({
  name: "customer-ops",
  version: "1.0.0",
  catalog,
  html,
});
```

See [Local Server](/examples/local-server/) and [HTTP Server](/examples/http-server/) for native upstream server wiring.
