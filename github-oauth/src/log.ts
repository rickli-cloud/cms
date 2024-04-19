import {
  ACCESS_LOG_FILE,
  ACCESS_LOG_LEVEL,
  ERR_LOG_FILE,
  LOG_LEVEL,
  ERR_LOG_LEVEL,
} from "./config";

import * as log4js from "log4js";

log4js.configure({
  appenders: {
    console: {
      type: "console",
    },
    file: {
      type: "file",
      filename: ERR_LOG_FILE,
    },
    "file-filter": {
      type: "logLevelFilter",
      appender: "file",
      level: ERR_LOG_LEVEL,
    },
    accessfile: {
      type: "file",
      filename: ACCESS_LOG_FILE,
    },
    "access-filter": {
      type: "logLevelFilter",
      appender: "accessfile",
      level: ACCESS_LOG_LEVEL,
    },
  },
  categories: {
    default: {
      appenders: ["console"],
      level: "off",
    },
    Server: {
      appenders: ["console", "file-filter"],
      level: LOG_LEVEL,
    },
    Access: {
      appenders: ["console", "access-filter"],
      level: ACCESS_LOG_LEVEL,
    },
  },
});

process.on("uncaughtException", async (error, origin) => {
  Log.error("uncaughtException ", error, origin);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  Log.error("unhandledRejection", promise, reason);
  process.exit(1);
});

export const Log = log4js.getLogger("Server");
export const AccessLog = log4js.getLogger("Access");
