import { get } from "svelte/store";
import { Octo, handleOctoPromise } from ".";
import { Backend } from "$lib/store/config";

export interface UserData {
  login: string;
  name: string | null;
  avatar_url: string;
}

export async function getUser(): Promise<UserData> {
  return await handleOctoPromise(
    get(Octo).rest.users.getAuthenticated({ ...get(Backend).git })
  );
}
