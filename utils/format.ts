import i18n from "@/lib/i18n";

export function formatOdometer(odometer: number | null, showUnit?: boolean) {
  return Intl.NumberFormat(i18n.language, {
    style: showUnit ? "unit" : undefined,
    unit: "kilometer",
  }).format((odometer ?? 0) / 1000);
}

export function formatDistance(km: number) {
  return Intl.NumberFormat(i18n.language, {
    style: "unit",
    unit: "kilometer",
  }).format(Math.round(km * 10) / 10);
}

export function formatSpeed(metersPerSecond: number, showUnit?: boolean) {
  return Intl.NumberFormat(i18n.language, {
    style: showUnit ? "unit" : undefined,
    unit: "kilometer-per-hour",
  }).format(Math.round(metersPerSecond * 3.6));
}

export function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);

  return date.toLocaleString(i18n.language, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
