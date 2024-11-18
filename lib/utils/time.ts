/**
 * Converts a timestamp into a human-readable relative time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns A string in the format "Updated X units ago" or "Updated just now"
 * @example
 * getTimeAgo(Date.now() - 3600000) // Returns "Updated 1 hour ago"
 * getTimeAgo(Date.now() - 60000) // Returns "Updated 1 minute ago"
 * getTimeAgo(Date.now()) // Returns "Updated just now"
 */
export function getTimeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `Updated ${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "Updated just now";
}
