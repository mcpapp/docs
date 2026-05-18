---
title: Sync Store
description: Bind synced server records through MCPApp state.
---

Synchronization is a third state layer:

```text
server-owned product state
  durable records, permissions, workflow state

spec state
  initial render model returned with the json-render spec

synced client data
  local copies of server records kept current by a sync engine
```

Product truth stays on the server. The spec gives the first render enough data to paint. A sync store keeps selected server records available locally for fast reads and live updates.

This example uses Electric as the sync engine. The same adapter shape works for any store that can return a snapshot and notify subscribers.

## State contract

`MCPApp` accepts controlled state:

```tsx
<MCPApp state={state} />
```

A sync store can use that same contract:

```tsx
<MCPApp state={syncState(store)} handlers={handlers} />
```

The adapter exposes the current local snapshot and subscribes to future updates:

```ts
type StateAdapter<TState> = {
  getSnapshot(): TState;
  subscribe(listener: () => void): () => void;
};

export function syncState<TState>(
  store: StateAdapter<TState>,
): StateAdapter<TState> {
  return {
    getSnapshot() {
      return store.getSnapshot();
    },
    subscribe(listener) {
      return store.subscribe(listener);
    },
  };
}
```

Specs can bind to the snapshot like any other controlled state.

## Shape

Use Electric's TypeScript client through a backend API endpoint.

```ts
import { Shape, ShapeStream } from "@electric-sql/client";

const tasksStream = new ShapeStream({
  url: "/api/sync/tasks",
});

export const tasksShape = new Shape(tasksStream);
```

The API endpoint owns authorization and the actual Electric shape definition.

Electric is a good fit for read-path synchronization with Postgres. It syncs subsets of Postgres data into local clients over HTTP using Shapes.

```text
Postgres
  ↓
Electric Shape
  ↓
local sync store
  ↓
syncState(store)
  ↓
MCPApp
```

In production, proxy Electric requests through the backend API. The backend owns the shape definition and authorization boundary.

## State helper

Adapt the materialized shape to the `MCPApp state` prop.

```ts
type Task = {
  id: string;
  title: string;
  complete: boolean;
};

type TaskState = {
  rows: Task[];
};

type StateAdapter<TState> = {
  getSnapshot(): TState;
  subscribe(listener: () => void): () => void;
};

export function electricSyncState(shape): StateAdapter<TaskState> {
  let snapshot: TaskState = { rows: [] };

  return {
    getSnapshot() {
      return snapshot;
    },
    subscribe(listener) {
      return shape.subscribe(({ rows }) => {
        snapshot = { rows };
        listener();
      });
    },
  };
}
```

Specs can bind to `/rows` to render the local synced records.

## Server-first writes

Keep writes in action handlers and send them to the server.

```tsx
const handlers = {
  "task.complete": async (params) => {
    await fetch("/api/actions", {
      method: "POST",
      body: JSON.stringify({
        intent: "task.complete",
        params,
      }),
    });
  },
};
```

The server writes to Postgres. Electric syncs the resulting change back into the shape.

## App

Compose the synced state with `MCPApp`.

```tsx
import { MCPApp } from "@mcpapp/react";
import { electricSyncState } from "./electric-sync-state";
import { tasksShape } from "./tasks-shape";

const handlers = {
  "task.complete": async (params) => {
    await fetch("/api/actions", {
      method: "POST",
      body: JSON.stringify({
        intent: "task.complete",
        params,
      }),
    });
  },
};

export function TasksApp() {
  return (
    <MCPApp
      state={electricSyncState(tasksShape)}
      handlers={handlers}
    />
  );
}
```

The generated spec describes the UI. The synced store supplies live task rows. The handler keeps mutations on the server.

## When to use sync

Use a sync store when the app needs:

- fast reads after the initial render,
- live updates from other sessions,
- offline-tolerant browsing of already-synced records,
- large or frequently changing record sets,
- local filtering and sorting over synced data.

Use plain spec state when the data is small, request-scoped, or only needed for the current generated screen.

## References

- [Electric Sync](https://electric.ax/docs/sync/)
- [Electric Shapes](https://electric.ax/docs/sync/guides/shapes)
- [Electric Writes](https://electric.ax/docs/sync/guides/writes)
- [Electric React integration](https://electric.ax/docs/sync/integrations/react)
