import { writable } from "svelte/store";
import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";
import type { OctokitResponse } from "@octokit/types";

import { endSession } from "$lib/store/session";
import type { Config } from "$lib/config";

export const Octo = writable<Octokit>();

export function initApi(git: Config.Backend["git"], auth?: string) {
  Octo.set(
    new Octokit({
      ...git,
      auth,
      log: console,
    })
  );
}

export async function handleOctoPromise<
  T extends Promise<OctokitResponse<Awaited<T>["data"]>>
>(
  promise: T,
  codes: { [x: number]: (err: RequestError) => void } = {}
): Promise<Awaited<T>["data"]> {
  return promise
    .then((response) => {
      // TODO: check rate limiting & warn user.

      return response.data;
    })
    .catch((err) => {
      if (!(err instanceof RequestError)) throw err;

      if (err.status === 401) endSession();

      const handle = codes[err.status];
      if (!handle) throw err;
      handle(err);
    });
}
