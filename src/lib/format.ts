export function utc(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(iso: string, days: number) {
  const date = utc(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string) {
  return Math.round((utc(b).getTime() - utc(a).getTime()) / 86400000);
}

export function dow(iso: string) {
  return utc(iso).getUTCDay();
}

export function monthIndex(iso: string) {
  return Number(iso.slice(5, 7));
}

export function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function miles(value: number) {
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(Math.round(value))} milhas`;
}

export function shortDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(utc(iso));
}

export function rangeLabel(start: string, end: string) {
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${fmt.format(utc(start))} – ${fmt.format(utc(end))}`;
}

export function yymmdd(iso: string) {
  return iso.slice(2).replaceAll("-", "");
}
