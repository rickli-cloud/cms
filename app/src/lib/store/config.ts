import { writable } from "svelte/store";

import { config, type FullConfig, type InternalConfig } from "$lib/config";
import { transformBackendConfig } from "$lib/config/backend";
import { transformCollectionConfig } from "$lib/config/collection";

export const Backend = writable<InternalConfig.Backend>();
export const Collections = writable<InternalConfig.Collections>();
// export const Storage = writable<Config.Full["storage"]>();

Collections.subscribe(console.log);

export async function initConfig(data: FullConfig): Promise<void> {
  console.time("initConfig");

  const cfg = await config.parseAsync(data);

  Backend.set(transformBackendConfig(cfg.backend));
  Collections.set(transformCollectionConfig(cfg.collections));
  // Storage.set(cfg.storage);

  console.timeEnd("initConfig");
}
