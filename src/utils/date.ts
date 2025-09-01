// src/utils/date.ts
export function toDisplay(
  input: string | Date | null | undefined,
  fallback = '-'
): string {
  if (!input) return fallback;

  const raw = input instanceof Date ? input.toISOString() : String(input).trim();

  // Ambil bagian tanggal saja (pisah di 'T' ATAU spasi)
  const onlyDate = raw.split('T')[0].split(' ')[0];

  // Support delimiter '-' atau '/'
  const m = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(onlyDate);
  if (!m) return fallback;

  const [, y, mm, dd] = m;
  return `${dd}-${mm}-${y}`;
}

export function toISO(
  input: string | Date | null | undefined,
  fallback = ''
): string {
  if (!input) return fallback;

  if (input instanceof Date) return input.toISOString().slice(0,10);

  const s = String(input).trim();
  const justDate = s.includes('T') ? s.split('T')[0] : s.split(' ')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(justDate)) return justDate;

  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
  if (m) {
    const [, dd, mm, y] = m;
    return `${y}-${mm}-${dd}`;
  }
  return fallback;
}
