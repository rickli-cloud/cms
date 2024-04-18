const k = 1024;
const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i >= sizes.length) return "number too large";

  return `${parseFloat(
    (bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)
  )} ${sizes[i]}`;
}
