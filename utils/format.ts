import i18n from "@/lib/i18n";

export function formatOdometer(odometer: number | null) {
  return Intl.NumberFormat(i18n.language, {
    unit: "kilometer-per-hour",
  }).format((odometer ?? 0) / 1000);
}

export function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);

  return date.toLocaleString(i18n.language, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
