import yaml from "yaml";

export default class Frontmatter {
  public static readonly regex = /^\s*---\s*([\s\S]*?(?=\s*---))\s*---\s*/;

  public static parse<T extends object>(content: string): T {
    const parsed = this.regex.exec(content);

    if (parsed?.length !== 2) {
      throw new Error("Failed to parse frontmatter.", {
        cause: `Expected to get a array containing 2 items. Got ${parsed?.length} items instead.`,
      });
    }

    return yaml.parse(parsed[1]);
  }
}
