import { get, writable } from "svelte/store";
import { RequestError } from "@octokit/request-error";

import { Backend /* Storage */ } from "./config";
import { ApplicationError } from "$lib/utils/error";
import { getUser, type UserData } from "$lib/api/user";
import { initApi } from "$lib/api";
import Auth from "$lib/utils/auth";

export const User = writable<UserData | undefined>(undefined);
User.subscribe(console.log);

export const storageKey = "cms:session:token";

export async function initUser(token?: string | null) {
  console.time("initUser");

  const { auth, git } = get(Backend);
  // const { session: storage } = get(Storage);

  if (!token && token !== null) {
    token = sessionStorage.getItem(storageKey);
  }

  if (!token) {
    token = await auth(Auth);
    if (token) sessionStorage.setItem(storageKey, token);
  }

  if (!token) {
    throw new Error(
      "Failed to grab auth token :( Try refreshing the page to try again."
    );
  }

  initApi(git, token);

  User.set(
    await getUser().catch((err) => {
      if (err instanceof RequestError && err.status !== 401) {
        throw new ApplicationError("Bad credentials", {
          disableStack: true,
          cause: err,
          actions: [
            {
              name: "Retry",
              call: () => window.location.reload(),
            },
          ],
        });
      }

      throw err;
    })
  );

  console.timeEnd("initUser");
}

export async function initSession() {
  console.time("initSession");

  const { force_auth, git } = get(Backend);
  // const { session: storage } = get(Storage);

  const token = sessionStorage.getItem(storageKey);

  if (force_auth || token) await initUser(token);
  else initApi(git);

  console.timeEnd("initSession");
}

export function endSession(reload: boolean = true) {
  console.time("endSession");

  // const { session: storage } = get(Storage);

  sessionStorage.removeItem(storageKey);
  User.set(undefined);

  console.timeEnd("endSession");

  if (reload) window.location.reload();
}
