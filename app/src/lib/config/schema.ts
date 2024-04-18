// import { z } from "zod";
// import type { GetZodType } from ".";

// export type StorageOptions = GetZodType<typeof storageOptions>;
// export const storageOptions = z.object({
//   session: z
//     .object({
//       location: z.instanceof(Storage).default(sessionStorage),
//       git_token_key: z.string().default("cms:user:token"),
//     })
//     .default({}),
// });

// export type BackendOptions = GetZodType<typeof backendOptions>;
// export const backendOptions = z.object({
//   allow_forking: z.boolean().default(true),
//   require_login: z.boolean().default(true),
//   git: z.object({
//     repo: z.string(),
//     owner: z.string(),
//     baseUrl: z.string().optional(),
//   }),
//   auth: z.function().returns(
//     z
//       .string()
//       .min(1)
//       .or(z.promise(z.string().min(1)))
//   ),
// });

// export type Frontmatter = GetZodType<typeof frontmatter>;
// export const frontmatter = z.record(z.string(), z.instanceof(z.ZodType));

// export type BaseCollection = GetZodType<typeof baseCollection>;
// export const baseCollection = z.object({
//   frontmatter: frontmatter.optional(),
//   name: z.string().min(1),
// });

// export type CollectionFile = GetZodType<typeof collectionFile>;
// export const collectionFile = z.object({
//   path: z.string().min(1),
//   name: z.string().min(1),
// });

// export type FileCollection = GetZodType<typeof fileCollection>;
// export const fileCollection = z
//   .object({
//     type: z.literal("file"),
//     files: z.array(collectionFile).min(1),
//     actions: z
//       .object({
//         delete: z.boolean().optional(),
//       })
//       .optional(),
//   })
//   .and(baseCollection);

// export type FolderCollection = GetZodType<typeof folderCollection>;
// export const folderCollection = z
//   .object({
//     type: z.literal("dir"),
//     path: z.string().min(1),
//     actions: z
//       .object({
//         delete: z.boolean().optional(),
//         create: z.boolean().optional(),
//       })
//       .optional(),
//   })
//   .and(baseCollection);

// export type CollectionType = GetZodType<typeof collectionType>;
// export const collectionType = z.union([fileCollection, folderCollection]);

// export type CollectionsOptions = GetZodType<typeof collectionsOptions>;
// export const collectionsOptions = z.array(collectionType).min(1);

// export type CmsOptions = GetZodType<typeof cmsOptions>;
// export const cmsOptions = z.object({
//   backend: backendOptions,
//   collections: collectionsOptions,
//   storage: storageOptions.default({}),
// });
