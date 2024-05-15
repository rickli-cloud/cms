import { z } from "zod";
import backend from "./backend";
// import storage from "./storage";
import collection from "./collection";
import type { File, Folder, frontmatter } from "./collection";

export const config = z.object({
  collections: z.array(collection),
  // storage: storage.default({}),
  backend,
});

export namespace Config {
  export type Full = z.infer<typeof config>;
  export type Backend = z.infer<typeof backend>;
  // export type Storage = z.infer<typeof storage>;

  export namespace Collection {
    export type File = z.infer<typeof File>;
    export type Folder = z.infer<typeof Folder>;
    export type Union = z.infer<typeof collection>;
    export type UnionArray = z.infer<Zod.ZodArray<typeof collection>>;
    export type Frontmatter = z.infer<typeof frontmatter>;
  }
}
