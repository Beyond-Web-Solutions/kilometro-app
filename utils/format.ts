import i18n from "@/lib/i18n";

export function formatOdometer(odometer: number | null, showUnit?: boolean) {
  return Intl.NumberFormat(i18n.language, {
    style: showUnit ? "unit" : undefined,
    unit: "kilometer",
  }).format((odometer ?? 0) / 1000);
}

export function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);

  return date.toLocaleString(i18n.language, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
