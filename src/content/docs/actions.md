---
title: Actions
description: How component events become application behavior.
---

Actions are how a rendered UI asks the app to do something.

The chain has four links:

```text
user interaction
  → component event
  → spec action binding
  → MCPApp handler
```

The confusing part is that the event and the action are different things. The event comes from the component. The action is the application intent chosen by the spec.

## 1. Components emit events

A registry component decides which events it can emit.

For example, the default web `Button` emits a `press` event when the user clicks it. As an app developer, you usually do not write that click handler. It is part of the registry component.

```tsx
<Button label="Approve" />
```

When clicked, the component emits this event:

```ts
"press"
```

That event name is small and component-level. It means "the button was pressed." It does not say what the product should do.

## 2. The spec maps the event to intent

The spec attaches meaning to the event.

```json
{
  "type": "Button",
  "props": {
    "label": "Approve"
  },
  "on": {
    "press": {
      "action": "approval.submit",
      "params": {
        "approvalId": "app_123"
      }
    }
  }
}
```

Read this from the inside out:

```text
Button emits "press"
  → spec has on.press
  → on.press says action is "approval.submit"
  → params are { approvalId: "app_123" }
```

The action name is a string. It becomes the lookup key for your handler.

## 3. MCPApp looks up the handler

Define action handlers from the same catalog, then pass the resulting handlers to `MCPApp`.

```tsx
import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";

export const { registry, handlers } = defineRegistry(catalog, {
  actions: {
    "approval.submit": async (params) => {
      await fetch("/api/actions", {
        method: "POST",
        body: JSON.stringify({
          intent: "approval.submit",
          params,
        }),
      });
    },
  },
});

export function App() {
  return (
    <MCPApp
      registry={registry}
      handlers={handlers}
    />
  );
}
```

When the button emits `press`, `MCPApp` reads the spec binding, finds `approval.submit`, and calls the registered handler with the spec params:

```ts
{
  approvalId: "app_123",
}
```

That is the mapping. There is no switch statement and no generated client code. The action name in the spec matches the key in the handlers object.

## 4. The handler does the work

Most handlers should send intent to the server.

```tsx
export const { handlers } = defineRegistry(catalog, {
  actions: {
    "approval.submit": async (params) => {
      await fetch("/api/actions", {
        method: "POST",
        body: JSON.stringify({
          intent: "approval.submit",
          params,
        }),
      });
    },
  },
});
```

The server checks permissions, performs the workflow, and returns the next spec through the app's normal spec-loading path.

## Handler arguments

Action handlers are defined by `defineRegistry`.

| Argument | Description |
| --- | --- |
| `params` | The params from the spec action binding, typed from the catalog. |
| `setState` | Updates local view state for drafts, pending UI, and optimistic feedback. |
| `state` | Current local view state when controlled state is enabled. |

Use server API calls for product behavior. Use `setState` for local interaction state.

## Local UI feedback

Use `setState` when the UI should update immediately.

```tsx
export const { handlers } = defineRegistry(catalog, {
  actions: {
    "approval.submit": async (params, setState) => {
      setState((state) => ({
        ...state,
        approval: {
          ...state.approval,
          pending: true,
        },
      }));

      await fetch("/api/actions", {
        method: "POST",
        body: JSON.stringify({
          intent: "approval.submit",
          params,
        }),
      });
    });
  },
});
```

The local state change gives immediate feedback. The server response still decides the next durable UI state.

For synced server records, keep writes server-first and bind synced data through a state adapter. See [Sync Store](/examples/sync-store/).

## Typed params

Declare action params in the catalog, then create handlers from the same catalog.

```ts
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { defineRegistry } from "@json-render/react";
import { z } from "zod";

const catalog = defineCatalog(schema, {
  components: {},
  actions: {
    "approval.submit": {
      params: z.object({
        approvalId: z.string(),
      }),
    },
  },
});

export const { handlers } = defineRegistry(catalog, {
  actions: {
    "approval.submit": async (params) => {
      await submitApproval(params.approvalId);
    },
  },
});
```

`params.approvalId` is typed from the catalog. See [Type Safety](/type-safety/) for the full stack.

## Naming actions

Use application intent:

- `approval.submit`
- `customer.refresh`
- `invoice.export`
- `draft.save`
- `record.open`

The component event says what happened in the UI. The action name says what the app should do.
