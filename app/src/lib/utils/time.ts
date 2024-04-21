export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * To a human readable full format string.
 */
export function formatTime(time: string | number) {
  return new Date(time).toLocaleString();
}
