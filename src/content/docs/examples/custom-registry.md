---
title: Custom Registry
description: Add product components to an app.
---

Start with the default registry. Add a custom registry when the generated UI needs product vocabulary.

```tsx
import { MCPApp, WebHost } from "@mcpapp/react";
import { registry } from "./registry";

export function App() {
  return (
    <WebHost>
      <MCPApp registry={registry} />
    </WebHost>
  );
}
```

## Registry

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

## When to use this

Use custom components when generic primitives make specs too verbose or too ambiguous.

Good product components are stable nouns in your app:

- customer card,
- approval panel,
- invoice timeline,
- record preview.

See [Registry](/registry/) for the full guide.
