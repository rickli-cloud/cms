import { z } from "zod";

export default z.object({
  session: z
    .object({
      location: z.instanceof(Storage).default(sessionStorage),
      git_token_key: z.string().default("cms:user:token"),
    })
    .default({}),
});
