import { z } from "zod";
import { Base64 } from "./base64";

export type CollectionFileRef = z.infer<typeof collectionFileRef>;
export const collectionFileRef = z.object({
  collection: z.string(),
  name: z.string(),
  path: z.string(),
});

export type CommitFileRef = z.infer<typeof commitFileRef>;
export const commitFileRef = z.object({
  sha: z.string(),
  collection: z.string().optional(),
  name: z.string().optional(),
  path: z.string().optional(),
});

export class Ref extends String {
  public constructor(data: any) {
    super(Base64.urlEncode(JSON.stringify(data)));
  }

  public static parse<T = unknown>(data: string): T {
    return JSON.parse(Base64.urlDecode(data));
  }
}
