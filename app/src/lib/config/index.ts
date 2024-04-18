import { z } from "zod";
import backend from "./backend";
import storage from "./storage";
import collection from "./collection";

export type * from "./index.d";

export const config = z.object({
  collections: z.array(collection),
  storage: storage.default({}),
  backend,
});
