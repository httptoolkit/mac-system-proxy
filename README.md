# Mac-System-Proxy [![Build Status](https://github.com/httptoolkit/mac-system-proxy/workflows/CI/badge.svg)](https://github.com/httptoolkit/mac-system-proxy/actions) [![Available on NPM](https://img.shields.io/npm/v/mac-system-proxy.svg)](https://npmjs.com/package/mac-system-proxy)

> _Part of [HTTP Toolkit](https://httptoolkit.tech): powerful tools for building, testing & debugging HTTP(S)_

Access the Mac system proxy settings from Node.js. Use it like so:

```javascript
import { getMacSystemProxy } from 'mac-system-proxy';

const proxy = await getMacSystemProxy();
```

The promise from `getMacSystemProxy` resolves to something like:

```json
{
    "ExceptionsList": ["localhost", "127.0.0.1"],
    "ExcludeSimpleHostnames": "1",
    "HTTPEnable": "1",
    "HTTPPort": "8000",
    "HTTPProxy": "127.0.0.1",
    "HTTPSEnable": "1",
    "HTTPSPort": "8443",
    "HTTPSProxy": "127.0.0.1",
}
```

This just parses and return the values directly from `scutil --proxy`, so you'll still need to interpret them yourself for your application. If `scutil --proxy` is unavailable, fails, or the output can't be parsed, the promise will be rejected.

You can see the known return values in the TypeScript types [here](https://github.com/httptoolkit/mac-system-proxy/blob/main/src/index.ts#L5). If you're aware of more possible values, please open a PR!