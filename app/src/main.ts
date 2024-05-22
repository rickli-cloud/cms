import "./app.css"; // only works for development.

import { z } from "zod";
import Cms from "./App.svelte";
import auth from "./lib/utils/auth.ts";

import type {
  Config as config,
  FullConfig as Config,
} from "./lib/config/index.ts";

export { Cms, auth, z, type Config, type config };
