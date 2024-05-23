import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Config, InternalConfig } from "./index";

export const Frontmatter = {
  default: z.record(z.any()),
  internal: z.record(z.record(z.unknown())),
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
  serializable: z.union([Folder.default, File.default]),
};

export function transformCollectionConfig(
  cfg: Config.Collections
): InternalConfig.Collections {
  return cfg.map((i: Config.Collection) => ({
    ...i,
    frontmatter: i.frontmatter
      ? Object.fromEntries(
          Object.entries(i.frontmatter).map(([key, val]) => [
            key,
            val instanceof z.ZodType ? zodToJsonSchema(val) : val,
          ])
        )
      : undefined,
  }));
}

export function serializeCollectionConfig(
  cfg: Config.Collections
): InternalConfig.Collections {
  return transformCollectionConfig(cfg);
}
