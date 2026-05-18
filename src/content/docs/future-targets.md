---
title: Future
description: Roadmap for additional host adapters.
---

Host adapters let the same MCP App model run in more environments.

## Native mobile

Native mobile can follow the same model with a mobile host and a mobile registry.

```tsx
<NativeHost>
  <MCPApp />
</NativeHost>
```

The registry maps the catalog to native components instead of web or terminal components.

## Slack

Slack can use a constrained catalog that maps to Block Kit or another Slack-native surface.

```tsx
<SlackHost>
  <MCPApp />
</SlackHost>
```

The host adapter handles Slack transport, message formatting, and capability context.

## Other chat hosts

Other chat surfaces can follow the Slack pattern with their own catalog and registry.

```tsx
<ChatHost>
  <MCPApp />
</ChatHost>
```

Each adapter should keep host-specific behavior in the host and keep `MCPApp` focused on the MCP Apps spec.

## Wire protocol expansion

The current wire contract is json-render over MCP Apps. Future protocol work should keep that contract stable while adding translation layers for other UI standards such as OpenUI.

The goal is to let an MCP App speak to hosts that already standardize around a different component or interaction schema without forcing app authors to rewrite their product views.

Planned phases:

- Define a protocol boundary that separates app state, actions, streaming patches, and component vocabulary.
- Add an experimental adapter that maps a json-render catalog to an OpenUI-compatible schema.
- Validate the adapter with a constrained component set before expanding to richer layout, form, and action primitives.
- Preserve type safety by generating adapter types from the shared catalog instead of maintaining duplicate component definitions.
- Document the unsupported surface area explicitly so hosts can degrade gracefully when a protocol cannot express a component or interaction.

Protocol adapters should remain optional. `MCPApp` should continue to render json-render specs directly, while adapters translate at the edge for hosts that prefer OpenUI or another standard.
