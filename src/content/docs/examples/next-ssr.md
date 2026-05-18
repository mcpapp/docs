---
title: Next App SSR
description: Use upstream @json-render/next when JSON describes a full Next.js app.
---

Use `@json-render/next` when the JSON owns a full Next.js app: routes, layouts, metadata, loaders, and static params.

This is a separate renderer path from `WebHost` and `MCPApp`.

## Catalog

`@json-render/next` provides its own schema.

```ts
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/next/server";
import { z } from "zod";

export const catalog = defineCatalog(schema, {
  components: {
    CustomerPage: {
      props: z.object({
        customerId: z.string(),
      }),
      description: "Customer detail page",
    },
  },
  actions: {},
});
```

## Route

Create the Next route exports with upstream `createNextApp`.

```ts
import { createNextApp } from "@json-render/next/server";
import { catalog } from "@/catalog";
import { loadNextAppSpec } from "@/specs/next-app";

const { Page, generateMetadata, generateStaticParams } = createNextApp({
  async spec() {
    const rawSpec: unknown = await loadNextAppSpec();
    const result = catalog.validate(rawSpec);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  },
  loaders: {
    loadCustomer: async ({ customerId }) => {
      return db.customers.findById(customerId);
    },
  },
});

export { generateMetadata, generateStaticParams };
export default Page;
```

Put that in the `[[...slug]]` catch-all route described by the upstream docs.

## When to Choose This

Choose `@json-render/next` when the generated JSON is the app structure itself.

Choose `WebHost` SSR when the page is still a host for an MCP App and the generated JSON is the active `root` + `elements` view rendered by `MCPApp`.

Use the upstream [`@json-render/next` docs](https://json-render.dev/docs/api/next) for the full Next API.
