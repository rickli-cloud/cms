import { z } from "zod";

export const frontmatter = z.record(z.string(), z.instanceof(z.ZodType));

const Base = z.object({
  name: z.string().min(1),
  frontmatter: frontmatter.optional(),
});

export const FileData = z.object({
  name: z.string().optional(),
  path: z.string(),
});

const FileOptions = z.object({
  type: z.literal("file"),
  name: z.string(),
  files: z.array(FileData).min(1),
});

export const File = FileOptions.and(Base);

const FolderOptions = z.object({
  type: z.literal("dir"),
  name: z.string(),
  path: z.string(),
  actions: z
    .object({
      create: z.boolean().default(false),
      delete: z.boolean().default(false),
    })
    .default({}),
});

export const Folder = FolderOptions.and(Base);

export default z.union([File, Folder]);
