import { writable } from "svelte/store";

import { config, type Config } from "$lib/config";

export const Backend = writable<Config.Full["backend"]>();
export const Storage = writable<Config.Full["storage"]>();
export const Collections = writable<Config.Full["collections"]>();

export async function initConfig(data: Config.Full): Promise<Config.Full> {
  console.time("initConfig");

  const cfg = await config.parseAsync(data);

  Backend.set(cfg.backend);
  Collections.set(cfg.collections);
  Storage.set(cfg.storage);

  console.timeEnd("initConfig");
  return cfg;
}
