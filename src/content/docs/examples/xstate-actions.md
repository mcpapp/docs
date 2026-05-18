---
title: Actions + XState
description: Use XState for local interaction state.
---

This example keeps local interaction state in XState and sends product effects back to the server through actions.

It also defines the XState helpers inline so the connection is visible.

## Machine

The machine owns local view state.

```ts
import { assign, setup } from "xstate";

export const approvalMachine = setup({
  types: {
    context: {} as {
      notes: string;
      saving: boolean;
    },
    events: {} as
      | { type: "notes.changed"; value: string }
      | { type: "approval.saving" }
      | { type: "approval.saved" },
  },
}).createMachine({
  context: {
    notes: "",
    saving: false,
  },
  on: {
    "notes.changed": {
      actions: assign({
        notes: ({ event }) => event.value,
      }),
    },
    "approval.saving": {
      actions: assign({ saving: true }),
    },
    "approval.saved": {
      actions: assign({ saving: false }),
    },
  },
});
```

## State helper

`xstateState(actor)` adapts the machine context to the `MCPApp state` prop.

```ts
type ApprovalState = {
  notes: string;
  saving: boolean;
};

type StateAdapter<TState> = {
  getSnapshot(): TState;
  subscribe(listener: () => void): () => void;
};

export function xstateState(actor): StateAdapter<ApprovalState> {
  return {
    getSnapshot() {
      return actor.getSnapshot().context;
    },
    subscribe(listener) {
      return actor.subscribe(() => {
        listener();
      });
    },
  };
}
```

The spec can bind to values in the machine context, such as `/notes` and `/saving`.

## Action helper

`xstateActions(actor)` maps action names to XState event types.

```ts
export function xstateActions(actor, options = {}) {
  return new Proxy(options.effects ?? {}, {
    get(effects, actionName) {
      if (actionName in effects) {
        return effects[actionName];
      }

      return (params) => {
        actor.send({
          type: actionName,
          ...params,
        });
      };
    },
  });
}
```

With that helper, this action binding:

```json
{
  "action": "notes.changed",
  "params": {
    "value": "Looks good"
  }
}
```

sends this event:

```ts
actor.send({
  type: "notes.changed",
  value: "Looks good"
});
```

The transition logic stays in the machine.

## Persistence helper

Use a small persistence helper when local state should survive reloads.

```ts
import { useEffect, useMemo } from "react";

export function useXStatePersistence(actor, { key, storage }) {
  const savedSnapshot = useMemo(() => {
    const saved = storage.getItem(key);
    return saved ? JSON.parse(saved) : undefined;
  }, [key, storage]);

  useEffect(() => {
    if (savedSnapshot) {
      actor.start(savedSnapshot);
    }

    const subscription = actor.subscribe((snapshot) => {
      storage.setItem(key, JSON.stringify(snapshot));
    });

    return () => subscription.unsubscribe();
  }, [actor, key, savedSnapshot, storage]);
}
```

This is for drafts and continuity. Saved product state should still go through the server.

## App

Use the helpers with `MCPApp`.

```tsx
import { useActorRef } from "@xstate/react";
import { MCPApp } from "@mcpapp/react";
import { approvalMachine } from "./approval.machine";
import {
  useXStatePersistence,
  xstateActions,
  xstateState,
} from "./xstate-helpers";

export function ApprovalApp() {
  const actor = useActorRef(approvalMachine);

  useXStatePersistence(actor, {
    key: "approval-machine",
    storage: localStorage,
  });

  const handlers = xstateActions(actor, {
    effects: {
      "approval.submit": async (params) => {
        actor.send({ type: "approval.saving" });
        await fetch("/api/actions", {
          method: "POST",
          body: JSON.stringify({
            intent: "approval.submit",
            params,
          }),
        });
        actor.send({ type: "approval.saved" });
      },
    },
  });

  return (
    <MCPApp
      state={xstateState(actor)}
      handlers={handlers}
    />
  );
}
```

The default mapping handles local events like `notes.changed`. The `approval.submit` effect handles the server call.

See [Actions](/actions/) for the event-to-action mapping.
