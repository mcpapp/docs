---
title: Next
description: Near-term host adapters.
---

The next adapter should be `CliHost`.

```tsx
<CliHost>
  <MCPApp />
</CliHost>
```

`CliHost` should provide:

- MCP server connection,
- terminal input and output,
- tool/result loop,
- default registry from `@json-render/ink`,
- terminal capability context.

Use the upstream [`@json-render/ink` docs](https://json-render.dev/docs/api/ink) for terminal rendering.
