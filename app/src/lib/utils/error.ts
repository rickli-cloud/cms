export interface CustomErrorArgs {
  name?: string;
  title?: string;
  cause?: unknown;
  action?: {
    name: string;
    call: () => void;
  };
  disableStack?: boolean;
  disableCause?: boolean;
}

export class CustomError extends Error {
  public readonly name: string;
  public readonly title?: CustomErrorArgs["title"];
  public readonly disableStack?: CustomErrorArgs["disableStack"];
  public readonly disableCause?: CustomErrorArgs["disableCause"];
  public readonly action?: CustomErrorArgs["action"];

  public constructor(message: string, args: CustomErrorArgs = {}) {
    super(message, { cause: args.disableCause ? undefined : args.cause });
    this.name = args.name || "ApplicationError";
    this.title = args.title;
    this.action = args.action;
    this.disableStack = args.disableStack;
    this.disableCause = args.disableCause;
  }
}
