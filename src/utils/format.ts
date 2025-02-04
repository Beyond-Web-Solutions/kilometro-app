import i18n from "@/src/lib/i18n";
import { formatDistanceStrict } from "date-fns";
import { nl } from "date-fns/locale";

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

export function formatDuration(
  dateStr1: string | null,
  dateStr2: string | null,
) {
  if (!dateStr1 || !dateStr2) {
    return null;
  }

  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);

  return formatDistanceStrict(date2, date1, { locale: nl });
}

export function formatUsername(
  empty: string,
  firstName?: string,
  lastName?: string,
  email?: string,
) {
  if (!firstName && !lastName) {
    return email;
  }

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return empty;
}
