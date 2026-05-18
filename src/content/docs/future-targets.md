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
