import "./app.css"; // only works for development.
import Cms from "./App.svelte";
import auth from "$lib/utils/auth.js";
import type {
  Config as config,
  FullConfig as Config,
} from "$lib/config/index.js";

export { Cms, auth, type Config, type config };
