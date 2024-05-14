import { z } from "zod";

export default z.object({
  allow_fork: z.boolean().default(true),
  force_auth: z.boolean().default(false),
  git: z.object({
    repo: z.string(),
    owner: z.string(),
    baseUrl: z.string().optional(),
  }),
  auth: z.function().returns(
    z
      .string()
      .min(1)
      .or(z.promise(z.string().min(1)))
  ),
});
