import type backend from "./backend";
import type storage from "./storage";
import type collection from "./collection";
import type { File, Folder, frontmatter } from "./collection";

export {};

export type GetZodType<T extends Zod.ZodType> = ReturnType<T["parse"]>;

export namespace Config {
  export type Full = GetZodType<typeof import("./index").config>;
  export type Backend = GetZodType<typeof backend>;
  export type Storage = GetZodType<typeof storage>;
  export namespace Collection {
    export type File = GetZodType<typeof File>;
    export type Folder = GetZodType<typeof Folder>;
    export type Union = GetZodType<typeof collection>;
    export type UnionArray = Zod.ZodArray<GetZodType<typeof collection>>;
    export type Frontmatter = GetZodType<typeof frontmatter>;
  }
}
