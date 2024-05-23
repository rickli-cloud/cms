import { z } from "zod";
import type { Config, InternalConfig } from "./index";

export const BaseBackend = z.object({
  allow_fork: z.boolean().default(true),
  force_auth: z.boolean().default(false),
  git: z.object({
    repo: z.string(),
    owner: z.string(),
    baseUrl: z.string().optional(),
  }),
});

export const AuthMethods = {
  urlParameter: z.function().returns(z.string().optional()),
  prompt: z
    .function()
    .args(
      z.string().optional(),
      z.boolean().default(true),
      z.number().default(5000),
      z.boolean().optional()
    )
    .returns(z.promise(z.string())),
  githubOAuth: z
    .function()
    .args(z.string(), z.string().optional())
    .returns(z.promise(z.string())),
};

export const AuthFunction = z
  .function()
  .args(z.object(AuthMethods))
  .returns(z.string().or(z.promise(z.string())));

export const Backend = {
  auth: AuthFunction,
  base: BaseBackend,
  internal: z
    .object({
      auth: AuthFunction,
    })
    .and(BaseBackend),
  default: z
    .object({
      auth: z.string().or(AuthFunction),
    })
    .and(BaseBackend),
  serializable: z
    .object({
      auth: z.string(),
    })
    .and(BaseBackend),
};

const AsyncFunction: typeof Function = Object.getPrototypeOf(
  async function () {}
).constructor;

export function transformBackendConfig(
  cfg: Config.Backend
): InternalConfig.Backend {
  return {
    ...cfg,
    auth:
      typeof cfg.auth === "function"
        ? cfg.auth
        : (new AsyncFunction("auth", cfg.auth) as z.infer<typeof AuthFunction>),
  };
}

function serializeFunction(fn: Function): string {
  const fnString = fn.toString();

  const fnRegex =
    /^\s*(async)?\s*(function)?\s*([a-zA-Z0-9]*)\s*\(([a-zA-Z0-9,.{}\(\)]*)\)\s*(=>)?\s*/;
  if (!fnRegex.test(fnString)) {
    throw new Error("Cannot identify string as a function :(", {
      cause: `String of function: "${fnString}" does not match regex: "${fnRegex.source}".`,
    });
  }
  const processedFnString = fnString.replace(fnRegex, "").replace(/\s+/gm, " ");

  const fnContainerRegex = /^\s*{([^]*)}\s*$/;
  if (fnContainerRegex.test(processedFnString)) {
    const fnContent = fnContainerRegex.exec(processedFnString);
    if (!fnContent) throw new Error("Failed to get function content :(");
    return fnContent[1].trim();
  }

  console.log("fn does not have cage!", processedFnString);

  return "return " + processedFnString;
}

export function serializeBackendConfig(
  cfg: Config.Backend
): z.infer<typeof Backend.serializable> {
  return {
    ...cfg,
    auth:
      typeof cfg.auth === "function" ? serializeFunction(cfg.auth) : cfg.auth,
  };
}
