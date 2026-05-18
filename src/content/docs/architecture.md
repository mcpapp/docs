---
title: Architecture
description: How MCPApp, host adapters, json-render, and the backend fit together.
---

The architecture has one base app view: `MCPApp`.

`MCPApp` is the iframe-side client for an MCP App. It receives the active json-render spec from the host, applies the resolved registry and state adapter, and renders the app.

Host adapters provide MCP Apps behavior for environments that need it, such as browsers.

## Shell layering

```text
Native MCP Apps host              Browser
ChatGPT · Codex · Claude          ordinary web page
┌────────────────────────┐        ┌──────────────────────────────┐
│ MCP Apps host          │        │ WebHost                      │
│  ui:// HTML resource   │        │  MCP transport + app bridge  │
│   sandboxed iframe     │        │   ui:// HTML resource        │
│    MCPApp              │        │    sandboxed iframe          │
│     json-render app    │        │     MCPApp                   │
│     registry + state   │        │      json-render app         │
└────────────────────────┘        │      registry + state        │
                                  └──────────────────────────────┘

```

The base app view stays the same. The environment around it changes.

For standalone browser deployments, `WebHost` can also receive a validated `initialSpec` during server-side rendering:

```text
Browser SSR lane
request → framework loader → validated initialSpec → WebHost → MCPApp
```

Native MCP Apps hosts continue to load the MCP Apps HTML resource and run the app in the host-managed iframe.

## Data flow

```text
1. Backend
   data, auth, tools, AI generation, spec storage
   @json-render/mcp + MCP SDK
        ↓
2. json-render
   catalog, spec schema, state binding, streaming, renderer
        ↓
3. App
   host renders the UI resource
   MCPApp receives the spec
   registry + state adapter render the view
        ↺ user actions return to the server and produce the next spec
```

The backend creates or loads the spec. json-render constrains and renders the spec. MCP Apps carries the UI resource and tool results between the server, host, and iframe.

## What MCPApp owns

`MCPApp` handles the app-side MCP Apps lifecycle:

- app identity: `name` and `version`,
- connection to the host,
- current spec, loading state, connected state, and errors,
- initial state from `spec.state ?? {}`,
- host context such as theme and sizing information when available,
- registry resolution,
- rendering through json-render.

In a browser MCP App iframe, the renderer is `@json-render/react`.

## What host adapters own

Host adapters supply the runtime behavior that native MCP Apps hosts already provide.

`WebHost` adapts a browser page:

- connect to the MCP server endpoint,
- accept a validated `initialSpec` for server-rendered first paint,
- ask the server for the app result,
- fetch the referenced `ui://` resource,
- render the resource in a sandbox,
- forward messages between the iframe and the MCP server,
- provide the default web registry.

## Server wiring

Server wiring uses upstream MCP and json-render packages directly.

- `createMcpApp` creates a configured MCP server for a json-render catalog and an HTML app resource.
- `registerJsonRenderTool` adds the render tool to an existing MCP server.
- `registerJsonRenderResource` registers the UI resource.
- `buildAppHtml` can turn bundled JavaScript and CSS into self-contained HTML for the app resource.
- MCP SDK transports expose the server over stdio or Streamable HTTP.

See [Local Server](/examples/local-server/), [HTTP Server](/examples/http-server/), and [Static Serving](/examples/static-serving/) for server examples.

For browser SSR, see [Server-Side Rendering](/server-side-rendering/) and [WebHost SSR](/examples/webhost-ssr/). For full Next.js app rendering, use upstream [`@json-render/next`](https://json-render.dev/docs/api/next).

## Registry resolution

The registry should usually come from the host.

```tsx
<WebHost>
  <MCPApp />
</WebHost>
```

`WebHost` provides a web registry based on `@json-render/shadcn`.

`MCPApp` can still accept an explicit registry for custom components:

```tsx
<MCPApp registry={registry} />
```

See [Registry](/registry/) for the resolution order.
