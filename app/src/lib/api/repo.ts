import { get } from "svelte/store";
import { Octo, handleOctoPromise } from ".";
import { Backend } from "$lib/store/config";

export interface ContentData {
  type: "dir" | "file" | "submodule" | "symlink";
  path: string;
  name: string;
  content?: string;
  size?: number;
}

export interface InternalContentData extends ContentData {
  collection: string;
}

export async function getContent(
  path: string,
  git = get(Backend).git
): Promise<ContentData | ContentData[]> {
  return await handleOctoPromise(
    get(Octo).rest.repos.getContent({ ...git, path })
  );
}

export async function getContributors(git = get(Backend).git) {
  return handleOctoPromise(get(Octo).rest.repos.listContributors({ ...git }));
}

export async function getCommits(path?: string, git = get(Backend).git) {
  return await handleOctoPromise(
    get(Octo).rest.repos.listCommits({ ...git, path })
  );
}

export async function getCommitDetail(sha: string, git = get(Backend).git) {
  return await handleOctoPromise(
    get(Octo).rest.repos.getCommit({ ...git, ref: sha })
  );
}
