export function formatPrice(value: number): string {
  if (value >= 1_000_000) {
    // Number() drops a trailing ".0", so 1.98M rounds to "2M" rather than "2.0M".
    const millions = Number((value / 1_000_000).toFixed(1));
    return `₱${millions}M`;
  }
  return `₱${value.toLocaleString("en-PH")}`;
}

export function formatFullPrice(value: number): string {
  return `₱${value.toLocaleString("en-PH")}`;
}

export function formatDate(dateString: string): string {
  // Dates are stored as "YYYY-MM-DD", which JS parses as UTC midnight. Pin the
  // timezone so the server's locale can't shift the displayed day.
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: dateString.length === 10 ? "UTC" : "Asia/Manila",
  });
}
