---
title: WebHost SSR
description: Server-render the first browser view with a validated json-render spec.
---

This example renders the first browser view on the server, then lets `WebHost` continue through the MCP endpoint after hydration.

## Loader

The loader fetches or generates the spec and validates it before render.

```ts
import { catalog } from "../catalog";
import { customerProfileSpec } from "../specs/customer-profile";

export async function loadSpec(request: Request) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId") ?? "cus_123";
  const rawSpec: unknown = await customerProfileSpec(customerId);
  const result = catalog.validate(rawSpec);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
```

Use the same shape in Next loaders, Remix loaders, Astro server routes, Hono handlers, or any server renderer that can pass props into React.

## Page

Pass the validated spec to `WebHost`.

```tsx
import { MCPApp, WebHost } from "@mcpapp/react";
import { loadSpec } from "./load-spec";

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

The first HTML response is rendered from `initialSpec`. During hydration, the client reuses that same spec instead of fetching the first screen again.

## After Hydration

After hydration, `WebHost` connects to the default MCP endpoint.

```tsx
<WebHost initialSpec={spec} endpoint="/mcp">
  <MCPApp />
</WebHost>
```

Actions still use params and stay server-first.

```tsx
const handlers = {
  "customer.refresh": async (params) => {
    await fetch("/api/actions", {
      method: "POST",
      body: JSON.stringify({
        intent: "customer.refresh",
        params,
      }),
    });
  },
};
```

The server action can update durable state, regenerate the spec, or start a stream. `WebHost` owns that live browser connection after the initial SSR pass.

## Component Rule

Registry components used in the first render must be server-renderable. Move browser-only work into effects or event handlers.

See [Server-Side Rendering](/server-side-rendering/) for the full model.
