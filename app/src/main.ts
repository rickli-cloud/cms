import "./app.css"; // only works for development.

import { z } from "zod";
import Cms from "./App.svelte";
import auth from "./lib/utils/auth.ts";
import {
  serializeConfig,
  type Config as config,
  type FullConfig as Config,
  type SerializableConfig,
} from "./lib/config/index.ts";

export {
  Cms,
  auth,
  serializeConfig,
  z,
  type Config,
  type config,
  type SerializableConfig,
};
