---
title: Registry
description: How default and custom registries work.
---

A registry is the bridge between a json-render spec and the host UI.

The spec says:

```json
{
  "type": "CustomerCard",
  "props": {
    "name": "Ada Lovelace"
  }
}
```

The registry says what `CustomerCard` means in the current host.

## Default registries

Most apps start with a host-provided default registry.

```tsx
<WebHost>
  <MCPApp />
</WebHost>
```

`WebHost` provides a web registry based on `@json-render/shadcn`. That gives the app a useful default vocabulary for layout, text, buttons, forms, feedback, and common interface primitives.

Use the upstream docs for package-specific details:

- [`@json-render/shadcn`](https://json-render.dev/docs/api/shadcn)
- [json-render registry](https://json-render.dev/docs/registry)

## When to create a custom registry

Use the default registry for generic UI.

Create a custom registry when the app needs domain components:

- `CustomerCard`
- `ApprovalPanel`
- `InvoiceTimeline`
- `PolicySummary`
- `RecordPreview`

Domain components give the model better vocabulary. They also keep generated specs smaller and more stable.

## Create a custom registry

Define the component catalog, then map catalog entries to host components.

```tsx
import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";
import { CustomerCard } from "./components/customer-card";
import { ApprovalPanel } from "./components/approval-panel";

export const { registry } = defineRegistry(catalog, {
  components: {
    CustomerCard,
    ApprovalPanel,
  },
});
```

The catalog describes what can be generated. The registry provides the implementation.

## Use a custom registry for one app

Pass it to `MCPApp`.

```tsx
<MCPApp registry={registry} />
```

Inside a browser host:

```tsx
<WebHost>
  <MCPApp registry={registry} />
</WebHost>
```

This is the narrowest override. It affects one app view.

## Use a custom registry for a host

Pass it to the host when every nested app should use the same registry.

```tsx
<WebHost registry={registry}>
  <MCPApp />
</WebHost>
```

This is useful for product shells where all generated screens share the same component vocabulary.

## Extend the default registry

Most product apps should start from the default web registry and add domain components.

```tsx
import { defaultWebRegistry } from "@mcpapp/react/web";
import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";
import { CustomerCard } from "./components/customer-card";

export const { registry } = defineRegistry(catalog, {
  components: {
    ...defaultWebRegistry.components,
    CustomerCard,
  },
});
```

The exact merge API may depend on the upstream json-render registry shape. The principle is stable: keep the standard primitives, then add product vocabulary.

## Resolution order

`MCPApp` resolves registries in this order:

1. explicit `registry` prop on `MCPApp`,
2. registry from the nearest host, such as `WebHost`,
3. runtime default registry,
4. configuration error.

That keeps the common case small while preserving a clear escape hatch for custom UI.
