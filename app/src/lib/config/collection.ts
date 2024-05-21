import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Config, InternalConfig } from ".";

export const Frontmatter = {
  zod: z.object({
    type: z.literal("zod"),
    records: z.record(z.string(), z.instanceof(z.ZodType)),
  }),
  json: z.object({
    type: z.literal("json"),
    schema: z.any(), // any better way to handle this?
  }),
  get default() {
    return z.union([this.zod, this.json]);
  },
  internal: z.any(),
};

const Base = z.object({
  name: z.string(),
});

const FileData = z.object({
  name: z.string().optional(),
  path: z.string(),
});

const FileOptions = z
  .object({
    type: z.literal("file"),
    name: z.string(),
    files: z.array(FileData).min(1),
  })
  .and(Base);

const FolderOptions = z
  .object({
    type: z.literal("dir"),
    name: z.string(),
    path: z.string(),
    actions: z
      .object({
        create: z.boolean().default(false),
        delete: z.boolean().default(false),
      })
      .default({}),
  })
  .and(Base);

export const File = {
  base: FileOptions,
  internal: FileOptions.and(
    z.object({
      frontmatter: Frontmatter.internal.optional(),
    })
  ),
  default: FileOptions.and(
    z.object({
      frontmatter: Frontmatter.default.optional(),
    })
  ),
};

export const Folder = {
  base: FolderOptions,
  internal: FolderOptions.and(
    z.object({
      frontmatter: Frontmatter.internal.optional(),
    })
  ),
  default: FolderOptions.and(
    z.object({
      frontmatter: Frontmatter.default.optional(),
    })
  ),
};

export const Collection = {
  internal: z.union([Folder.internal, File.internal]),
  default: z.union([Folder.default, File.default]),
};

export function transformCollectionConfig(
  cfg: Config.Collections
): InternalConfig.Collections {
  return cfg.map((i) => ({
    ...i,
    frontmatter: !i.frontmatter
      ? undefined
      : i.frontmatter.type === "zod"
      ? Object.fromEntries(
          Object.entries(i.frontmatter.records).map(([key, value]) => [
            key,
            zodToJsonSchema(value),
          ])
        )
      : i.frontmatter.schema,
  }));
}
