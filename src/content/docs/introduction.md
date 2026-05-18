---
title: Introduction
description: How the app runtime fits with json-render and MCP Apps.
---

Most AI apps still ship a fixed interface. The model can summarize data or choose a tool, but the page itself was built ahead of time.

Generative UI changes that. The server can return a JSON document that describes the interface for the current task: what components to show, what data to bind, what actions are available, and what should happen next.

This runtime layer makes that model practical when the UI is an MCP App.

## The basic idea

The UI contract is json-render. A spec is data. The app receives a json-render spec and renders it with a registry that maps catalog entries to real components.

```tsx
import { MCPApp } from "@mcpapp/react";

<MCPApp />
```

In ChatGPT, Codex, Claude, Cursor, VS Code, and other native MCP Apps hosts, that is the whole client-side shape. The host loads the app resource, passes the active spec into the iframe, and mediates calls back to the MCP server.

## When a host is needed

A browser page uses an adapter that can talk to the MCP server, load the app resource, and forward messages between the page and the app iframe.

```tsx
import { MCPApp, WebHost } from "@mcpapp/react";

<WebHost>
  <MCPApp />
</WebHost>
```

## What stays upstream

The framework stays small by relying on upstream standards and libraries for the hard parts:

- json-render for [specs](https://json-render.dev/docs/specs), [registries](https://json-render.dev/docs/registry), [streaming](https://json-render.dev/docs/streaming), and renderers.
- `@json-render/mcp` for MCP Apps integration.
- MCP Apps for the host protocol and app resource model.
- Host-specific json-render packages such as `@json-render/shadcn` for web rendering.

The docs here explain how those pieces are assembled into a small app framework. They link to upstream docs when the subject belongs to json-render or MCP Apps directly.

## What to read next

Start with [Quick Start](/quick-start/) to see the smallest working shape. Read [Architecture](/architecture/) when you want the full shell layering and data flow.
