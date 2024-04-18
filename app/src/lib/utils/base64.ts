/** The Unicode Problem
 * @see {@link https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings#answer-30106551}
 */
export class Base64 {
  public static encode(val: string) {
    return btoa(
      encodeURIComponent(val).replace(
        /%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(Number("0x" + p1));
        }
      )
    );
  }

  public static decode(val: string) {
    return decodeURIComponent(
      atob(val)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  public static urlEncode(val: string | object) {
    const encoded = this.encode(
      typeof val === "string" ? val : JSON.stringify(val)
    );
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  public static urlDecode(val: string) {
    return this.decode(val.replace(/-/g, "+").replace(/_/g, "/"));
  }
}
