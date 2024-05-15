import { get, writable } from "svelte/store";
import { RequestError } from "@octokit/request-error";

import { Backend /* Storage */ } from "./config";
import { CustomError } from "$lib/utils/error";
import { getUser, type UserData } from "$lib/api/user";
import { initApi } from "$lib/api";

export const User = writable<UserData | undefined>(undefined);
export const tokenStorageKey = "ODUsMjQ5LDIzOCwxNjUsMTYwLDk2LDE1MiwMTM";

User.subscribe(console.log);

export async function initUser(token?: string | null) {
  console.time("initUser");

  const { auth, git } = get(Backend);
  // const { session: storage } = get(Storage);

  if (!token) sessionStorage.location.getItem(tokenStorageKey);

  if (!token) {
    token = await auth();
    sessionStorage.location.setItem(tokenStorageKey, token);
  }

  initApi(git, token);

  User.set(
    await getUser().catch((err) => {
      if (!(err instanceof RequestError) || err.status !== 401) throw err;

      throw new CustomError("Bad credentials", {
        title: "Failed to log in user!",
        disableStack: true,
        action: {
          name: "Retry",
          call: () => window.location.reload(),
        },
        cause: err,
      });
    })
  );

  console.timeEnd("initUser");
}

export async function initSession() {
  console.time("initSession");

  const { force_auth, git } = get(Backend);
  // const { session: storage } = get(Storage);

  const token = sessionStorage.location.getItem(tokenStorageKey);

  if (force_auth || token) await initUser(token);
  else initApi(git);

  console.timeEnd("initSession");
}

export function endSession(reload: boolean = true) {
  console.time("endSession");

  // const { session: storage } = get(Storage);

  sessionStorage.location.removeItem(tokenStorageKey);
  User.set(undefined);

  console.timeEnd("endSession");

  if (reload) window.location.reload();
}
