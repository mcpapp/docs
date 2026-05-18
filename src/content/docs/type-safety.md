---
title: Type Safety
description: Keep the catalog as the typed contract from generation to rendering.
---

The catalog is the typed contract.

TypeScript can protect authored code: catalogs, registries, components, state adapters, and action handlers. JSON still crosses runtime boundaries. Specs from AI, databases, JSON files, streams, and MCP hosts should be treated as `unknown` until they are validated.

```text
catalog
  component props
  action params
        ↓
registry
  typed component props
  typed action handlers
        ↓
validated spec
  safe JSON boundary
        ↓
MCPApp
  typed registry + handlers + state adapter
```

## Catalog

Define component props and action params in the catalog.

```ts
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

export const catalog = defineCatalog(schema, {
  components: {
    CustomerCard: {
      props: z.object({
        id: z.string(),
        name: z.string(),
        plan: z.enum(["Free", "Pro", "Enterprise"]),
      }),
      description: "Customer summary card",
    },
  },
  actions: {
    "customer.refresh": {
      params: z.object({
        customerId: z.string(),
      }),
      description: "Refresh a customer from the source system",
    },
  },
});
```

Use upstream [json-render Catalog](https://json-render.dev/docs/catalog) for the complete catalog API.

## Registry

`defineRegistry(catalog, ...)` infers component props and action params from the catalog.

```tsx
import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";

export const { registry, handlers } = defineRegistry(catalog, {
  components: {
    CustomerCard: ({ props }) => {
      return (
        <article>
          <h2>{props.name}</h2>
          <p>{props.plan}</p>
        </article>
      );
    },
  },
  actions: {
    "customer.refresh": async (params) => {
      await fetch(`/api/customers/${params.customerId}/refresh`, {
        method: "POST",
      });
    },
  },
});
```

`props.name`, `props.plan`, and `params.customerId` are typed from the catalog. Use upstream [json-render Registry](https://json-render.dev/docs/registry) for renderer-specific details.

## JSON Boundaries

Validate JSON at every boundary.

```ts
export async function loadSpecFromDatabase(viewId: string) {
  const rawSpec: unknown = await db.views.findSpec(viewId);
  const result = catalog.validate(rawSpec);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
```

Use the same rule for AI output, stored specs, imported JSON files, streamed patch output, and MCP-host-provided specs. Runtime validation is what turns unknown JSON into a safe spec.

## Generated UI

AI should receive the catalog prompt and return JSON constrained by the catalog.

```ts
const prompt = catalog.prompt({
  customRules: ["Use CustomerCard for customer summaries."],
});

const rawSpec: unknown = await generateSpecWithModel({
  prompt,
  customer,
});

const result = catalog.validate(rawSpec);
if (!result.success) throw result.error;

return result.data;
```

The generated result is not type-safe until validation succeeds.

## State

State adapters should carry their own state type.

```ts
type StateAdapter<TState> = {
  getSnapshot(): TState;
  subscribe(listener: () => void): () => void;
};
```

That gives authored code type safety while still allowing the spec to bind to JSON paths in the state snapshot.

## Code Export

Dynamic rendering should stay the default. When you need exported static code, use upstream [`@json-render/codegen`](https://json-render.dev/docs/code-export) as an advanced path.
