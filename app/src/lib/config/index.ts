import { z } from "zod";

import { Backend, serializeBackendConfig } from "./backend";
import {
  Collection,
  File,
  Folder,
  Frontmatter,
  serializeCollectionConfig,
} from "./collection";

export const config = z.object({
  collections: z.array(Collection.default),
  backend: Backend.default,
});

export const serializableConfig = z.object({
  collections: z.array(Collection.serializable),
  backend: Backend.serializable,
});

/** Make config serializable using JSON.stringify / JSON.parse. */
export function serializeConfig(cfg: FullConfig): SerializableConfig {
  return {
    collections: serializeCollectionConfig(cfg.collections),
    backend: serializeBackendConfig(cfg.backend),
  };
}

/** Backwards compatibility test */
export function serializeTest(cfg: SerializableConfig): FullConfig {
  return cfg;
}

export type FullConfig = z.infer<typeof config>;
export type SerializableConfig = z.infer<typeof config>;

export namespace Config {
  export type Backend = z.infer<typeof Backend.default>;
  export type Collection = z.infer<typeof Collection.default>;
  export type Collections = z.infer<z.ZodArray<typeof Collection.default>>;
  export namespace collection {
    export type Folder = z.infer<typeof Folder.default>;
    export type File = z.infer<typeof File.default>;
    export type Frontmatter = z.infer<typeof Frontmatter.default>;
  }
}

export namespace InternalConfig {
  export type Backend = z.infer<typeof Backend.internal>;
  export type Collection = z.infer<typeof Collection.internal>;
  export type Collections = z.infer<z.ZodArray<typeof Collection.internal>>;
  export namespace collection {
    export type Folder = z.infer<typeof Folder.internal>;
    export type File = z.infer<typeof File.internal>;
    export type Frontmatter = z.infer<typeof Frontmatter.internal>;
  }
}
