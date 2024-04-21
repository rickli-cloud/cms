import { getWebFlowAuthorizationUrl } from "@octokit/oauth-methods";

/**
 * Top level function! Grabs token from url parameter named token. Also checks hash for token!
 */
export function urlParameter(): string | undefined {
  function handleParams(search: string, isHash?: boolean): string | undefined {
    const params = new URLSearchParams(search);

    if (params.has("token")) {
      const token = params.get("token") as string;

      params.delete("token");

      const url = new URL(window.location.toString());

      if (params.size) {
        if (isHash) {
          url.hash = url.hash.replace(/\?.*/, "") + "?" + params.toString();
        } else {
          url.search = "?" + params.toString();
        }
      } else {
        if (isHash) url.hash = url.hash.replace(/\?.*/, "");
        else url.search = "";
      }

      window.history.replaceState(null, "", url.toString());

      return token;
    }
  }

  const result = handleParams(window.location.search);
  if (result) return result;

  const hashResult = handleParams(
    window.location.hash.replace(/^#?.*\?/, ""),
    true
  );
  if (hashResult) return hashResult;
}

export async function prompt(
  token?: string,
  allowRetry: boolean = true,
  retryDelay: number = 5000,
  isRetry?: boolean
): Promise<string | undefined> {
  if (allowRetry && isRetry) {
    await new Promise((r) => setTimeout(r, retryDelay));
  }

  const input = await prompt("GitHub Token");

  return input?.length || !allowRetry
    ? input
    : prompt(token, allowRetry, retryDelay, true);
}

/**
 * Requires a self hosted github-oauth server and a github oauth app.
 */
export async function githubOAuth(
  clientId: string,
  token?: string
): Promise<string> {
  if (token) return token;

  const { url, state } = getWebFlowAuthorizationUrl({
    clientType: "oauth-app",
    clientId,
    scopes: ["repo"],
  });

  const popup = open(url, "_blank", "popup");

  return new Promise<string>((resolve) => {
    window.addEventListener("message", (ev) => {
      console.debug("message", ev);

      if (ev.data === "cms:oauth") {
        popup?.postMessage(`cms:state:${state}`, ev.origin);
      }

      if (/^cms:token:(.*)/.test(ev.data)) {
        resolve(/^cms:token:(.*)/.exec(ev.data)?.[1] as string);
      }
    });
  });
}
