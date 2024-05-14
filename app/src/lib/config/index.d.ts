import type { z } from "zod";

import type backend from "./backend";
import type storage from "./storage";
import type collection from "./collection";
import type { File, Folder, frontmatter } from "./collection";

export {};

export namespace Config {
  export type Full = z.infer<typeof import("./index").config>;
  export type Backend = z.infer<typeof backend>;
  export type Storage = z.infer<typeof storage>;

  export namespace Collection {
    export type File = z.infer<typeof File>;
    export type Folder = z.infer<typeof Folder>;
    export type Union = z.infer<typeof collection>;
    export type UnionArray = Zod.ZodArray<z.infer<typeof collection>>;
    export type Frontmatter = z.infer<typeof frontmatter>;
  }
}
