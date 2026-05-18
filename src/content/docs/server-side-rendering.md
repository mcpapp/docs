---
title: Server-Side Rendering
description: Render the first browser view on the server while keeping MCPApp focused on the MCP Apps contract.
---

Server-side rendering belongs to the browser host.

`MCPApp` still owns the MCP App view. It receives the active app state from the host and renders through json-render. For a normal web page, `WebHost` is the host, so it can also receive the first validated spec during server render.

```tsx
<WebHost initialSpec={spec}>
  <MCPApp />
</WebHost>
```

`MCPApp` does not take a `spec` prop. That keeps the same app component usable in native MCP Apps hosts and standalone browser pages.

## WebHost SSR

Use this path for the normal json-render `root` + `elements` spec.

```text
request
  ↓
framework loader
  fetch or generate spec
  validate spec with the catalog
  ↓
<WebHost initialSpec={spec}>
  <MCPApp />
</WebHost>
  ↓
server-rendered HTML
  ↓
hydration reuses initialSpec
  ↓
WebHost connects to /mcp for actions, refreshes, streams, and regenerated specs
```

The framework loader is whatever your app already uses: Next, Remix, Astro, Hono, Express, or a custom server. The framework loads data. The catalog validates JSON. `WebHost` renders the first view.

```tsx
import { MCPApp, WebHost } from "@mcpapp/react";
import { catalog } from "./catalog";
import { getCustomerProfileSpec } from "./specs/customer-profile";

export async function loadSpec(request: Request) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId") ?? "cus_123";
  const rawSpec: unknown = await getCustomerProfileSpec(customerId);
  const result = catalog.validate(rawSpec);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}

export async function CustomerProfilePage({
  request,
}: {
  request: Request;
}) {
  const spec = await loadSpec(request);

  return (
    <WebHost initialSpec={spec}>
      <MCPApp />
    </WebHost>
  );
}
```

The initial spec is a render snapshot. After hydration, `WebHost` uses the MCP endpoint for live work.

## Next App SSR

Use upstream [`@json-render/next`](https://json-render.dev/docs/api/next) when the JSON describes a full Next.js app: routes, layouts, metadata, loaders, and static params.

That path uses `NextAppSpec`, not the `MCPApp` browser-host contract.

```ts
import { defineCatalog } from "@json-render/core";
import { createNextApp, schema } from "@json-render/next/server";
import { z } from "zod";

const catalog = defineCatalog(schema, {
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

Use the upstream [`@json-render/next` docs](https://json-render.dev/docs/api/next) for the full Next.js API.

## Native MCP Apps Hosts

Native MCP Apps hosts load an interactive HTML resource from the MCP server. That resource is commonly produced with [`buildAppHtml`](https://json-render.dev/docs/api/mcp).

```text
MCP server
  ui:// HTML resource
  ↓
native MCP Apps host
  sandboxed iframe
  ↓
MCPApp
```

SSR is for standalone browser deployments through `WebHost`. Native MCP Apps follow the standard [MCP Apps resource lifecycle](https://modelcontextprotocol.io/extensions/apps/overview).

## Registry Components

Components used during `WebHost` SSR must render safely on the server. Keep browser-only APIs such as `window`, `document`, layout measurement, and storage access inside client effects or event handlers.

The same registry can still power the hydrated app. The constraint only applies to render-time code.

## Streaming

SSR should render the first useful spec. Progressive updates continue after hydration.

Use SSR for the first page. Use json-render streaming for the live sequence that follows.
