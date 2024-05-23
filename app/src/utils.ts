import { z } from "zod";

import {
  serializeConfig,
  type Config as config,
  type FullConfig as Config,
  type SerializableConfig,
} from "./lib/config/index.js";

export {
  z,
  serializeConfig,
  type Config,
  type config,
  type SerializableConfig,
};
