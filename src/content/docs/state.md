---
title: State
description: Server-owned state, spec state, and controlled state adapters.
---

Read [Actions](/actions/) first. Actions explain how UI events become handler calls. State explains what those handlers can read and update.

Durable state belongs on the backend. Local state is for view state: form drafts, visibility, pending UI, filters, selection, and interaction flow.

## Default state

Most apps put initial view state in the spec.

```json
{
  "root": "customer-page",
  "elements": {
    "customer-page": {
      "type": "CustomerCard",
      "props": {
        "name": { "$state": "/customer/name" },
        "plan": { "$state": "/customer/plan" }
      },
      "children": []
    }
  },
  "state": {
    "customer": {
      "name": "Ada Lovelace",
      "plan": "Enterprise"
    }
  }
}
```

The app stays small:

```tsx
<MCPApp />
```

For binding syntax, use upstream [json-render data binding](https://json-render.dev/docs/data-binding).

## Controlled state

Use the `state` prop when local state should be controlled by your app.

```tsx
<MCPApp state={state} />
```

The value is a state adapter. Adapters can support external stores, state machines, or persisted draft state.

```ts
type StateAdapter<TState> = {
  getSnapshot(): TState;
  subscribe(listener: () => void): () => void;
};
```

Keep the State guide focused on the contract:

- the spec can provide initial state,
- `MCPApp` can receive controlled state through `state`,
- actions can read or update local state when handlers need immediate UI feedback,
- durable business state stays on the backend.

For synced server records, see the [Sync Store example](/examples/sync-store/).

For a complete state-machine example, see [Actions + XState](/examples/xstate-actions/).
