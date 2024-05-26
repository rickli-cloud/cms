interface AppErr extends Omit<Omit<ApplicationError, "name">, "message"> {
  readonly name?: string;
}

export class ApplicationError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly cause: unknown;
  public readonly actions?: { name: string; call: () => void }[];
  public readonly disableStack?: boolean;
  public readonly disableCause?: boolean;

  public constructor(msg: string, args?: AppErr) {
    super(msg, { cause: args?.disableCause ? undefined : args?.cause });
    this.name = args?.name || "Application error";
    this.message = msg;
    this.cause = args?.cause;
    this.actions = args?.actions;
    this.disableStack = args?.disableStack;
    this.disableCause = args?.disableCause;
  }
}
