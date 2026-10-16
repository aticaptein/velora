export function formatCurrency(amount: number, currency = "EUR"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `€${amount.toLocaleString()}`;
  }
}

export function formatDays(days: number): string {
  if (days === 1) return "1 day";
  return `${days} days`;
}

export function formatDateString(isoDate: string): string {
  try {
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return isoDate;
  }
}

export function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VEL-${new Date().getFullYear()}-${code}`;
}
