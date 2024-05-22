import { z } from "zod";

import { Backend } from "./backend.ts";
import { Collection, File, Folder, Frontmatter } from "./collection.ts";

export const config = z.object({
  collections: z.array(Collection.default),
  backend: Backend.default,
});

export type FullConfig = z.infer<typeof config>;

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

// import { z } from "zod";
// import backend from "./backend";
// // import storage from "./storage";
// import collection from "./collection";
// import type { File, Folder, frontmatter } from "./collection";

// export const config = z.object({
//   collections: z.array(collection),
//   // storage: storage.default({}),
//   backend,
// });

// export namespace Config {
//   export type Full = z.infer<typeof config>;
//   export type Backend = z.infer<typeof backend>;
//   // export type Storage = z.infer<typeof storage>;

//   export namespace Collection {
//     export type File = z.infer<typeof File>;
//     export type Folder = z.infer<typeof Folder>;
//     export type Union = z.infer<typeof collection>;
//     export type UnionArray = z.infer<Zod.ZodArray<typeof collection>>;
//     export type Frontmatter = z.infer<typeof frontmatter>;
//   }
// }
