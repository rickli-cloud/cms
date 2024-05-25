# GitHub OAuth

Nodejs http server (http no express) to enable login thru GitHub's oauth flow with window to window communication capabilities.

## Environment

| Value               | Default     | Description                                         |
| ------------------- | ----------- | --------------------------------------------------- |
| OAUTH_CLIENT_ID     |             | GitHub OAuth app client ID                          |
| OAUTH_CLIENT_SECRET |             | GitHub OAuth app client secret                      |
| PORT                | `8000`      | Server Port                                         |
| LOG_PATH            | `$PWD/logs` | Log files location                                  |
| LOG_LEVEL           | `info`      | Written to stdout                                   |
| ERR_LOG_LEVEL       | `warn`      | Written to `$LOG_PATH/err.log`                      |
| ACCESS_LOG_LEVEL    | `info`      | Written to `$LOG_PATH/access.log` (separate logger) |

## Commands

### Dev

```sh
npm run dev
```

### Dev + debug

```sh
npm run dev:debug
```

### Build

```sh
npm run build
```

### Start

> This requires a build of the app!

```sh
npm run start
```

### Run checks

```sh
npm run check
```
