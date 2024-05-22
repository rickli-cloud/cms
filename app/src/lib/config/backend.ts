import { z } from "zod";
import type { Config, InternalConfig } from ".";

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
