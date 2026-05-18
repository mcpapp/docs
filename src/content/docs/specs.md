---
title: Spec
description: Complete server-side patterns for loading json-render specs.
---

The app accepts json-render specs as UI data. The source can change without changing the app component.

```tsx
<MCPApp />
```

The server decides which spec to return. This page shows source patterns as ordinary app functions. Call them from your MCP tool or server wiring.

```ts
type SpecContext = {
  args: Record<string, unknown>;
  user?: {
    permissions?: string[];
  };
};

export async function getSpec(context: SpecContext) {
  return getDashboardSpec(context);
}
```

Use upstream [json-render specs docs](https://json-render.dev/docs/specs) for the complete spec format. See [Local Server](/examples/local-server/) and [HTTP Server](/examples/http-server/) for MCP server wiring.

## Hand-authored JSON

Use hand-authored specs for stable screens, tests, demos, and fixtures.

```json
{
  "root": "customer-page",
  "elements": {
    "customer-page": {
      "type": "Page",
      "props": { "title": "Customer profile" },
      "children": ["customer-card"]
    },
    "customer-card": {
      "type": "CustomerCard",
      "props": {
        "name": "Ada Lovelace",
        "status": "active",
        "plan": "Enterprise"
      },
      "children": []
    }
  }
}
```

Import the JSON file and return it from your server code.

```ts
import customerProfile from "./specs/customer-profile.json" with { type: "json" };

export function getCustomerProfileSpec() {
  return customerProfile;
}
```

This is the simplest production path for fixed screens.

## Database-backed specs

Store specs when views are configured by users, generated once and reused, or versioned as product data.

```ts
export async function getSavedViewSpec({ args }) {
  const view = await db.uiView.findUniqueOrThrow({
    where: {
      tenantId_slug_version: {
        tenantId: args.tenantId,
        slug: args.view ?? "customer-profile",
        version: args.version ?? "published",
      },
    },
  });

  return view.spec;
}
```

The browser can pass route context to the server:

```tsx
<WebHost initialArgs={{ tenantId: "acme", view: "customer-profile" }}>
  <MCPApp />
</WebHost>
```

The app component stays the same. The source moved from a file to the database.

## Data-backed templates

Use a template when the layout is stable and the data changes per request.

```ts
function customerProfileSpec(customer: Customer) {
  return {
    root: "customer-page",
    elements: {
      "customer-page": {
        type: "Page",
        props: { title: "Customer profile" },
        children: ["customer-card", "account-actions"],
      },
      "customer-card": {
        type: "CustomerCard",
        props: {
          name: customer.name,
          status: customer.status,
          plan: customer.plan,
        },
        children: [],
      },
      "account-actions": {
        type: "ActionBar",
        props: {
          actions: ["refresh", "open-in-crm"],
        },
        children: [],
      },
    },
  };
}

export async function getCustomerProfileSpec({ args }) {
  const customer = await db.customer.findUniqueOrThrow({
    where: { id: args.customerId },
  });

  return customerProfileSpec(customer);
}
```

This is the best first pattern for ordinary product screens.

## Real-time AI generation

Generate specs when the view should be shaped by user intent, workflow state, or analysis results.

```ts
export async function getGeneratedCustomerSpec({ args, user }) {
  const customer = await db.customer.findUniqueOrThrow({
    where: { id: args.customerId },
  });

  const spec = await generateSpec({
    catalog,
    input: {
      instruction: args.prompt,
      customer,
      permissions: user.permissions,
    },
  });

  return validateSpec(spec, { catalog });
}
```

The catalog is the boundary for generation. Validation keeps the returned spec inside the supported component vocabulary.

## Progressive streams

Use streaming when the server can produce useful UI before the full spec is ready.

```ts
export async function* streamCustomerProfileSpec({ args }) {
  yield {
    op: "add",
    path: "/root",
    value: "customer-page",
  };

  yield {
    op: "add",
    path: "/elements/customer-page",
    value: {
      type: "Page",
      props: { title: "Building customer profile" },
      children: [],
    },
  };

  for await (const patch of generateCustomerProfilePatches(args.customerId)) {
    yield patch;
  }
}
```

The stream uses json-render's patch stream format. See upstream [json-render streaming](https://json-render.dev/docs/streaming) for the patch contract.

## Source selection

A server can choose a source at request time.

```ts
export async function getSpec(context) {
  if (context.args.viewId) {
    return loadSavedView(context.args.viewId);
  }

  if (context.args.prompt) {
    return generateCustomerView(context);
  }

  if (context.args.customerId) {
    return customerProfileFromDatabase(context.args.customerId);
  }

  return defaultDashboardSpec;
}
```

That is the point of keeping specs as data: the app view does not care where the spec came from.
