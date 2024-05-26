import { z } from "zod";

import "./app.css"; // only works for development.
import Cms from "./App.svelte";
import CriticalError from "./CriticalError.svelte";
import auth from "$lib/utils/auth.js";
import type {
  Config as config,
  FullConfig as Config,
} from "$lib/config/index.js";

export { Cms, z, auth, type Config, type config };

export default class CMS extends Cms {
  constructor(cfg: Config, target: Element = document.body) {
    try {
      super({ target, props: cfg });
    } catch (err) {
      new CriticalError({ target, props: { err } });
    }
  }
}
