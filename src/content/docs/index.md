---
title: MCPApp
description: A minimal MCP App runtime over json-render specs.
template: splash
hero:
  tagline: Render MCP Apps anywhere with json-render.
  image:
    file: ../../assets/framework.svg
  actions:
    - text: Quick start
      link: /quick-start/
      icon: right-arrow
    - text: Read the architecture
      link: /architecture/
      variant: secondary
---

MCPApp is a small open-source React framework for building MCP Apps with json-render.

The backend owns the product. It loads data, calls tools, generates or fetches a json-render spec, and sends that spec to the app. The frontend renders the spec with the right registry for the host it is running in.

In a native MCP Apps host, the app view is just `MCPApp`:

```tsx
import { MCPApp } from "@mcpapp/react";

<MCPApp />
```

In a browser, wrap the same app with `WebHost` so the page can provide the MCP Apps host behavior:

```tsx
import { MCPApp, WebHost } from "@mcpapp/react";

<WebHost>
  <MCPApp />
</WebHost>
```

That is the core contract. `MCPApp` handles the MCP Apps spec and renders through json-render. `WebHost` provides MCP Apps behavior for regular browser pages.

## Why this exists

Developers can define the component catalog, keep product logic on the server, and let the UI arrive as data.

The app surface stays small:

- json-render defines specs, catalogs, registries, state binding, streaming, and rendering.
- MCP Apps defines how an MCP server returns interactive app UI to a host.
- The framework composes those pieces into one app view and a small host adapter.

Start with [Quick Start](/quick-start/) for the shortest path, then read [Architecture](/architecture/) for the full layering model.
