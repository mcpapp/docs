---
title: Typed Stack
description: A typed customer profile flow from data to catalog, registry, actions, and spec validation.
---

This example keeps one typed contract through the stack. The catalog defines what can be rendered and what actions can be triggered. The registry and handlers inherit those types. Specs are validated before they reach the app.

## Domain data

```ts
export type Customer = {
  id: string;
  name: string;
  plan: "Free" | "Pro" | "Enterprise";
};
```

## Catalog

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
    Button: {
      props: z.object({
        label: z.string(),
      }),
      description: "Button that emits press",
    },
  },
  actions: {
    "customer.refresh": {
      params: z.object({
        customerId: z.string(),
      }),
      description: "Refresh customer data",
    },
  },
});
```

## Registry

```tsx
import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";

export const { registry, handlers } = defineRegistry(catalog, {
  components: {
    CustomerCard: ({ props }) => (
      <section>
        <h2>{props.name}</h2>
        <p>{props.plan}</p>
      </section>
    ),
    Button: ({ props, emit }) => (
      <button onClick={() => emit("press")}>{props.label}</button>
    ),
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

The component props and action params are inferred from the catalog.

## Spec factory

```ts
import type { Customer } from "./domain";

export function customerProfileSpec(customer: Customer) {
  return {
    root: "customer-page",
    elements: {
      "customer-page": {
        type: "CustomerCard",
        props: {
          id: customer.id,
          name: customer.name,
          plan: customer.plan,
        },
        children: ["refresh-button"],
      },
      "refresh-button": {
        type: "Button",
        props: {
          label: "Refresh",
        },
        on: {
          press: {
            action: "customer.refresh",
            params: {
              customerId: customer.id,
            },
          },
        },
        children: [],
      },
    },
  };
}
```

Authored factories are typed by ordinary TypeScript. Validate before returning the spec across a JSON boundary.

## Server boundary

```ts
import { catalog } from "./catalog";
import { customerProfileSpec } from "./customer-profile-spec";

export async function getCustomerProfileSpec(customerId: string) {
  const customer = await db.customers.findById(customerId);
  const rawSpec: unknown = customerProfileSpec(customer);
  const result = catalog.validate(rawSpec);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
```

Use the same validation step for generated specs, stored specs, imported JSON specs, and streamed specs.

## App

```tsx
import { MCPApp } from "@mcpapp/react";
import { registry, handlers } from "./registry";

export function App() {
  return <MCPApp registry={registry} handlers={handlers} />;
}
```

The client receives a validated spec and a registry whose component props and action params came from the same catalog.

See [Type Safety](/type-safety/) for the model.
