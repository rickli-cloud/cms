import { config } from "dotenv";
import { join } from "node:path";

config();

export const {
  /* oauth */
  OAUTH_CLIENT_ID: RAW_OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET: RAW_OAUTH_CLIENT_SECRET,

  /* server */
  PORT = "8000",

  /* log */
  LOG_LEVEL = "info", // main log level.
  LOG_PATH = join(__dirname, "/logs"),
  ERR_LOG_LEVEL = "warn", // written to "LOG_PATH/err.log".
  ACCESS_LOG_LEVEL = "info", // written to "LOG_PATH/access.log".
} = process.env;

if (!RAW_OAUTH_CLIENT_ID) {
  throw new Error("OAUTH_CLIENT_ID is required!");
}
if (!RAW_OAUTH_CLIENT_SECRET) {
  throw new Error("OAUTH_CLIENT_SECRET is required!");
}

export const OAUTH_CLIENT_ID = RAW_OAUTH_CLIENT_ID;
export const OAUTH_CLIENT_SECRET = RAW_OAUTH_CLIENT_SECRET;

export const ERR_LOG_FILE = join(LOG_PATH, "/err.log");
export const ACCESS_LOG_FILE = join(LOG_PATH, "/access.log");
