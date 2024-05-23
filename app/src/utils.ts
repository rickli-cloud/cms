import { z } from "zod";

import {
  serializeConfig,
  type Config as config,
  type FullConfig as Config,
  type SerializableConfig,
} from "./lib/config/index";

export {
  z,
  serializeConfig,
  type Config,
  type config,
  type SerializableConfig,
};
