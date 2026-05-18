---
title: WebHost
description: API reference for the browser host adapter.
---

`WebHost` adapts a regular browser page into an MCP Apps host.

```tsx
import { MCPApp, WebHost } from "@mcpapp/react";

<WebHost>
  <MCPApp />
</WebHost>
```

`WebHost` defaults to the common Streamable HTTP MCP endpoint, `/mcp`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | Usually one `MCPApp`. |
| `endpoint` | `string` | `"/mcp"` | Streamable HTTP MCP endpoint. |
| `initialSpec` | `Spec` | none | Validated first spec for server-side rendering. |
| `initialArgs` | `Record<string, unknown>` | `{}` | Route, tenant, prompt, or page context sent with the first render request. |
| `registry` | `Registry` | web default | Host-provided default registry for nested `MCPApp` components. |
| `capabilities` | `HostCapabilities` | browser defaults | Optional capability context exposed to the app. |
| `sandbox` | `SandboxPolicy` | secure default | Optional iframe sandbox policy. |
| `loading` | `ReactNode` | default loading UI | Custom loading view while the app resource is loading. |
| `error` | `(error: Error) => ReactNode` | default error UI | Custom host-level error renderer. |

## Basic usage

```tsx
<WebHost>
  <MCPApp />
</WebHost>
```

## Custom endpoint

```tsx
<WebHost endpoint="/api/mcp">
  <MCPApp />
</WebHost>
```

Use a custom endpoint when the MCP server is mounted behind an app framework route, proxy, tenant path, or hosted gateway.

## Initial arguments

```tsx
<WebHost initialArgs={{ customerId: "cus_123", tab: "activity" }}>
  <MCPApp />
</WebHost>
```

`initialArgs` is context the browser already has. The server decides how to use it.

Common values:

- route params,
- query params,
- tenant or workspace ids,
- a prompt for the first generated screen,
- deep-link context,
- safe host capability context.

## Server-side rendering

```tsx
<WebHost initialSpec={spec}>
  <MCPApp />
</WebHost>
```

`initialSpec` is for the first server-rendered browser view. Load and validate it in the app framework before passing it to `WebHost`. After hydration, `WebHost` connects to the MCP endpoint for actions, refreshes, streams, and regenerated specs.

See [Server-Side Rendering](/server-side-rendering/) and [WebHost SSR](/examples/webhost-ssr/).

## Registry override

```tsx
<WebHost registry={productWebRegistry}>
  <MCPApp />
</WebHost>
```

The host registry becomes the default registry for child `MCPApp` components.

## Transport

The MCP Streamable HTTP transport uses a single endpoint that supports `POST` and `GET`. The path is deployment-defined; `/mcp` is the default convention.
